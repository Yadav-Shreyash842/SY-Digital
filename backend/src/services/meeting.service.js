const mongoose = require("mongoose");
const Meeting = require("../models/Meeting");
const ApiError = require("../utils/ApiError");
const logger = require("../middlewares/logger");
const { emitToAdmins } = require("../socket/socketEmitter");
const { createNotification } = require("./notification.service");
const { sendEmail } = require("./email.service");
const meetingConfirmation = require("../emails/meetingConfirmation");

// ─── Helpers ────────────────────────────────────────────────────────────────

const MAX_LIMIT = 100;

const VALID_STATUSES = ["pending", "approved", "completed", "cancelled", "rejected"];

const escapeRegex = (value = "") => {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const parsePage = (value) => {
    const parsed = Number.parseInt(value, 10);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseLimit = (value) => {
    const parsed = Number.parseInt(value, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 10;
    }

    return Math.min(parsed, MAX_LIMIT);
};

const assertValidMeetingId = (meetingId) => {
    if (!mongoose.isValidObjectId(meetingId)) {
        throw new ApiError(400, "Invalid meeting ID");
    }
};

const SLOT_CONFLICT_FILTER = (meetingDate, meetingTime, excludeId = null) => {
  const filter = {
    meetingDate,
    meetingTime,
    status: { $in: ["pending", "approved"] },
  };
  if (excludeId) filter._id = { $ne: excludeId };
  return filter;
};

/**
 * Fire-and-forget side-effects: notification + socket.
 * Errors are logged as warnings — they must never block the main response.
 */
const fireMeetingSideEffects = async (notificationPayload, socketEvent, socketPayload) => {
  await Promise.all([
    createNotification(notificationPayload).catch((err) =>
      logger.warn(`[Meeting] Notification error: ${err.message}`)
    ),
    Promise.resolve().then(() => {
      try {
        emitToAdmins(socketEvent, socketPayload);
      } catch (err) {
        logger.warn(`[Meeting] Socket error: ${err.message}`);
      }
    }),
  ]);
};

// ─── Service Functions ───────────────────────────────────────────────────────

const createMeeting = async (meetingData) => {
  const existingMeeting = await Meeting.findOne(
    SLOT_CONFLICT_FILTER(meetingData.meetingDate, meetingData.meetingTime)
  ).lean();

  if (existingMeeting) {
    throw new ApiError(409, "This meeting slot is already booked.");
  }

  const meeting = await Meeting.create({
    ...meetingData,
    status: "pending",
    history: [{ action: "created", description: "Meeting booked successfully" }],
  });

  await meeting.populate("service", "title");

  // Non-critical side-effects — run in parallel, never block response
  fireMeetingSideEffects(
    {
      title: "New Meeting Booked",
      message: `${meeting.name} booked a meeting for ${meeting.meetingDate} at ${meeting.meetingTime}.`,
      type: "meeting",
      referenceId: meeting._id,
      referenceModel: "Meeting",
    },
    "newMeeting",
    { message: "A new meeting has been booked.", meeting }
  );

  sendEmail({
    to: meeting.email,
    subject: "Meeting Confirmation - SY Digital",
    html: meetingConfirmation({
      name: meeting.name,
      meetingDate: meeting.meetingDate,
      meetingTime: meeting.meetingTime,
      service: meeting.service.title,
    }),
  }).catch((err) => logger.warn(`[Meeting] Email error: ${err.message}`));

  return meeting;
};

const getAllMeetings = async (query) => {
  const page = parsePage(query.page);
  const limit = parseLimit(query.limit);
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.search) {
    const search = escapeRegex(query.search.trim());

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
  }

  if (query.status) filter.status = query.status;
  if (query.meetingType) filter.meetingType = query.meetingType;
  if (query.meetingDate) filter.meetingDate = query.meetingDate;

  const sortMap = {
    oldest: { createdAt: 1 },
    date: { meetingDate: 1 },
    newest: { createdAt: -1 },
  };
  const sort = sortMap[query.sort] || { createdAt: -1 };

  const [totalItems, meetings] = await Promise.all([
    Meeting.countDocuments(filter),
    Meeting.find(filter)
      .populate("service", "title category")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    meetings,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
  };
};

const getMeetingById = async (meetingId) => {
  assertValidMeetingId(meetingId);

  const meeting = await Meeting.findById(meetingId)
    .populate("service", "title category shortDescription")
    .populate("createdBy", "firstName lastName email")
    .lean();

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  return meeting;
};

const updateMeeting = async (meetingId, updateData) => {
  assertValidMeetingId(meetingId);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  const allowedFields = [
    "meetingDate",
    "meetingTime",
    "duration",
    "projectRequirements",
    "budget",
    "meetingType",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      meeting[field] = updateData[field];
    }
  });

  meeting.history.push({
    action: "updated",
    description: "Meeting details updated",
  });

  await meeting.save();
  await meeting.populate("service", "title");

  return meeting;
};

const deleteMeeting = async (meetingId) => {
  assertValidMeetingId(meetingId);

  const meeting = await Meeting.findByIdAndDelete(meetingId);

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  return meeting;
};

const updateMeetingStatus = async (
  meetingId,
  status,
  adminNotes = "",
  meetingLink = ""
) => {
  assertValidMeetingId(meetingId);

  if (!VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  meeting.status = status;
  meeting.history.push({
    action: status,
    description: adminNotes || `Meeting ${status}`,
  });

  if (adminNotes) meeting.adminNotes = adminNotes;
  if (status === "approved" && meeting.meetingType === "online") {
    meeting.meetingLink = meetingLink;
  }

  await meeting.save();
  await meeting.populate("service", "title");

  fireMeetingSideEffects(
    {
      title: "Meeting Status Updated",
      message: `${meeting.name}'s meeting status changed to ${status}.`,
      type: "meeting",
      referenceId: meeting._id,
      referenceModel: "Meeting",
    },
    "meetingStatusUpdated",
    { meetingId: meeting._id, status, meeting }
  );

  return meeting;
};

const rescheduleMeeting = async (meetingId, meetingDate, meetingTime) => {
  assertValidMeetingId(meetingId);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  const existingMeeting = await Meeting.findOne(
    SLOT_CONFLICT_FILTER(meetingDate, meetingTime, meetingId)
  ).lean();

  if (existingMeeting) {
    throw new ApiError(409, "Selected time slot is already booked.");
  }

  meeting.meetingDate = meetingDate;
  meeting.meetingTime = meetingTime;
  // "rescheduled" is not in the history enum — using "updated" with a descriptive message
  meeting.history.push({
    action: "updated",
    description: `Meeting rescheduled to ${meetingDate} at ${meetingTime}`,
  });

  await meeting.save();
  await meeting.populate("service", "title");

  fireMeetingSideEffects(
    {
      title: "Meeting Rescheduled",
      message: `${meeting.name}'s meeting has been rescheduled to ${meetingDate} at ${meetingTime}.`,
      type: "meeting",
      referenceId: meeting._id,
      referenceModel: "Meeting",
    },
    "meetingRescheduled",
    { meeting }
  );

  return meeting;
};

const cancelMeeting = async (meetingId, reason) => {
  assertValidMeetingId(meetingId);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  if (meeting.status === "completed") {
    throw new ApiError(400, "Completed meetings cannot be cancelled.");
  }

  if (meeting.status === "cancelled") {
    throw new ApiError(400, "Meeting is already cancelled.");
  }

  meeting.status = "cancelled";
  meeting.cancellationReason = reason;
  meeting.cancelledAt = new Date();
  meeting.history.push({ action: "cancelled", description: reason });

  await meeting.save();
  await meeting.populate("service", "title");

  fireMeetingSideEffects(
    {
      title: "Meeting Cancelled",
      message: `${meeting.name}'s meeting has been cancelled.`,
      type: "meeting",
      referenceId: meeting._id,
      referenceModel: "Meeting",
    },
    "meetingCancelled",
    { meeting }
  );

  return meeting;
};

const getMeetingHistory = async (meetingId) => {
  assertValidMeetingId(meetingId);

  const meeting = await Meeting.findById(meetingId).select("history").lean();

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  return meeting.history;
};

module.exports = {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  updateMeetingStatus,
  rescheduleMeeting,
  cancelMeeting,
  getMeetingHistory,
};

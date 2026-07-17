const Meeting = require("../models/Meeting");
const ApiError = require("../utils/ApiError");

const createMeeting = async (meetingData) => {

    const existingMeeting = await Meeting.findOne({

        meetingDate: meetingData.meetingDate,

        meetingTime: meetingData.meetingTime,

        status: {

            $in: [

                "pending",

                "approved",

            ],

        },

    });

    if (existingMeeting) {

        throw new ApiError(

            409,

            "This meeting slot is already booked."

        );

    }

   const meeting = await Meeting.create({

    ...meetingData,

    status: "pending",

    history: [
        {
            action: "created",
            description: "Meeting booked successfully",
        },
    ],

});

    return meeting;

};

const getAllMeetings = async (query) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Search by Client Name
    if (query.search) {

        filter.name = {
            $regex: query.search,
            $options: "i",
        };

    }

    // Status Filter
    if (query.status) {

        filter.status = query.status;

    }

    // Meeting Type
    if (query.meetingType) {

        filter.meetingType = query.meetingType;

    }

    // Meeting Date
    if (query.meetingDate) {

        filter.meetingDate = query.meetingDate;

    }

    // Sorting
    let sort = {
        createdAt: -1,
    };

    switch (query.sort) {

        case "oldest":
            sort = { createdAt: 1 };
            break;

        case "date":
            sort = { meetingDate: 1 };
            break;

        case "newest":
        default:
            sort = { createdAt: -1 };
            break;

    }

    const totalItems = await Meeting.countDocuments(filter);

    const meetings = await Meeting.find(filter)

        .populate(
            "service",
            "title category"
        )

        .sort(sort)

        .skip(skip)

        .limit(limit);

    return {

        meetings,

        pagination: {

            page,

            limit,

            totalItems,

            totalPages: Math.ceil(totalItems / limit),

        },

    };

};

const getMeetingById = async (meetingId) => {

    const meeting = await Meeting.findById(meetingId)

        .populate(
            "service",
            "title category shortDescription"
        )

        .populate(
            "createdBy",
            "firstName lastName email"
        );

    if (!meeting) {

        throw new ApiError(
            404,
            "Meeting not found"
        );

    }

    return meeting;

};

const updateMeeting = async (meetingId, updateData) => {

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
        throw new ApiError(
            404,
            "Meeting not found"
        );
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

    await meeting.save();

    return meeting;

};

const deleteMeeting = async (meetingId) => {

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {

        throw new ApiError(
            404,
            "Meeting not found"
        );

    }

    await Meeting.findByIdAndDelete(meetingId);

    return meeting;

};


const updateMeetingStatus = async (
    meetingId,
    status,
    adminNotes = "",
    meetingLink = ""
) => {

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {

        throw new ApiError(
            404,
            "Meeting not found"
        );

    }

    meeting.status = status;
    meeting.history.push({
    action: status,
    description: adminNotes || `Meeting ${status}`,
});

    if (adminNotes) {

        meeting.adminNotes = adminNotes;

    }

    if (
        status === "approved" &&
        meeting.meetingType === "online"
    ) {

        meeting.meetingLink = meetingLink;

    }

    await meeting.save();

    return meeting;

};

const rescheduleMeeting = async (
    meetingId,
    meetingDate,
    meetingTime
) => {

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
        throw new ApiError(
            404,
            "Meeting not found"
        );
    }

    // Check if new slot is already booked
    const existingMeeting = await Meeting.findOne({

        _id: { $ne: meetingId },

        meetingDate,

        meetingTime,

        status: {
            $in: [
                "pending",
                "approved",
            ],
        },

    });

    if (existingMeeting) {

        throw new ApiError(
            409,
            "Selected time slot is already booked."
        );

    }

    meeting.meetingDate = meetingDate;
    meeting.meetingTime = meetingTime;
    meeting.history.push({
    action: "rescheduled",
    description: `Meeting moved to ${meetingDate} at ${meetingTime}`,
});

    await meeting.save();

    return meeting;

};

const cancelMeeting = async (
    meetingId,
    reason
) => {

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {

        throw new ApiError(
            404,
            "Meeting not found"
        );

    }

    if (meeting.status === "completed") {

        throw new ApiError(
            400,
            "Completed meetings cannot be cancelled."
        );

    }

    if (meeting.status === "cancelled") {

        throw new ApiError(
            400,
            "Meeting is already cancelled."
        );

    }

    meeting.status = "cancelled";
    meeting.history.push({
    action: "cancelled",
    description: reason,
});

    meeting.cancellationReason = reason;

    meeting.cancelledAt = new Date();

    await meeting.save();

    return meeting;

};

const getMeetingHistory = async (meetingId) => {

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
        throw new ApiError(
            404,
            "Meeting not found"
        );
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
   
   
   
   
   
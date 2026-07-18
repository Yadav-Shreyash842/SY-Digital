const mongoose = require("mongoose");

const Payment = require("../models/Payment");
const Meeting = require("../models/Meeting");
const ApiError = require("../utils/ApiError");
const logger = require("../middlewares/logger");
const { emitToAdmins } = require("../socket/socketEmitter");
const { createNotification } = require("./notification.service");
const { sendEmail } = require("./email.service");
const paymentReceipt = require("../emails/paymentReceipt");

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_LIMIT = 100;

const VALID_PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

// Fields returned when a meeting is populated inside a payment response
const MEETING_POPULATE_FIELDS = "name email meetingDate meetingTime meetingType";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

const assertValidPaymentId = (paymentId) => {
    if (!mongoose.isValidObjectId(paymentId)) {
        throw new ApiError(400, "Invalid payment ID");
    }
};

/**
 * Fire-and-forget side-effects: notification + socket.
 * Errors are logged as warnings — they must never block the main response.
 */
const firePaymentSideEffects = async (notificationPayload, socketEvent, socketPayload) => {
    await Promise.all([
        createNotification(notificationPayload).catch((err) =>
            logger.warn(`[Payment] Notification error: ${err.message}`)
        ),
        Promise.resolve().then(() => {
            try {
                emitToAdmins(socketEvent, socketPayload);
            } catch (err) {
                logger.warn(`[Payment] Socket error: ${err.message}`);
            }
        }),
    ]);
};

// ─── Service Functions ────────────────────────────────────────────────────────

const createPayment = async (paymentData) => {
    if (!mongoose.isValidObjectId(paymentData.meeting)) {
        throw new ApiError(400, "Invalid meeting ID");
    }

    // Existence check only — no need to hydrate the full Meeting document
    const meetingExists = await Meeting.findById(paymentData.meeting)
        .select("_id")
        .lean();

    if (!meetingExists) {
        throw new ApiError(404, "Meeting not found");
    }

    // Duplicate check — only _id needed to confirm existence
    const existingPayment = await Payment.findOne({
        meeting: paymentData.meeting,
        paymentStatus: { $in: ["pending", "paid"] },
    })
        .select("_id")
        .lean();

    if (existingPayment) {
        throw new ApiError(409, "Payment already exists for this meeting");
    }

    const payment = await Payment.create(paymentData);

    await payment.populate("meeting", MEETING_POPULATE_FIELDS);

    firePaymentSideEffects(
        {
            title: "New Payment Created",
            message: `Payment of ${payment.amount} ${payment.currency} created for meeting by ${payment.clientName}.`,
            type: "payment",
            referenceId: payment._id,
            referenceModel: "Payment",
        },
        "paymentCreated",
        { payment }
    );

    return payment;
};

const getAllPayments = async (query) => {
    const page = parsePage(query.page);
    const limit = parseLimit(query.limit);
    const skip = (page - 1) * limit;

    const filter = {};

    // Search by client name or email
    if (query.search) {
        const search = escapeRegex(query.search.trim());

        if (search) {
            filter.$or = [
                { clientName: { $regex: search, $options: "i" } },
                { clientEmail: { $regex: search, $options: "i" } },
            ];
        }
    }

    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
    if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;
    if (query.currency) filter.currency = query.currency;

    // Date range filter on createdAt
    if (query.startDate || query.endDate) {
        filter.createdAt = {};

        if (query.startDate) {
            const startDate = new Date(query.startDate);

            if (!Number.isNaN(startDate.getTime())) {
                filter.createdAt.$gte = startDate;
            }
        }

        if (query.endDate) {
            const endDate = new Date(query.endDate);

            if (!Number.isNaN(endDate.getTime())) {
                filter.createdAt.$lte = endDate;
            }
        }

        if (Object.keys(filter.createdAt).length === 0) {
            delete filter.createdAt;
        }
    }

    // Sorting
    const sortMap = {
        oldest: { createdAt: 1 },
        amount_high: { amount: -1 },
        amount_low: { amount: 1 },
        newest: { createdAt: -1 },
    };
    const sort = sortMap[query.sort] || { createdAt: -1 };

    const [totalItems, payments] = await Promise.all([
        Payment.countDocuments(filter),
        Payment.find(filter)
            .populate("meeting", MEETING_POPULATE_FIELDS)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
    ]);

    return {
        payments,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.max(1, Math.ceil(totalItems / limit)),
        },
    };
};

const getPaymentById = async (paymentId) => {
    assertValidPaymentId(paymentId);

    const payment = await Payment.findById(paymentId)
        .populate("meeting", MEETING_POPULATE_FIELDS)
        .lean();

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    return payment;
};

const updatePaymentStatus = async (paymentId, paymentStatus) => {
    assertValidPaymentId(paymentId);

    if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        throw new ApiError(
            400,
            `Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(", ")}`
        );
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    payment.paymentStatus = paymentStatus;

    if (paymentStatus === "paid") {
        payment.paidAt = new Date();
    }

    await payment.save();
    await payment.populate("meeting", MEETING_POPULATE_FIELDS);

    // Socket event map — avoids verbose switch block
    const socketEventMap = {
        paid: "paymentVerified",
        failed: "paymentFailed",
        refunded: "paymentRefunded",
    };
    const socketEvent = socketEventMap[paymentStatus] || "paymentStatusUpdated";

    firePaymentSideEffects(
        {
            title: "Payment Status Updated",
            message: `Payment status changed to ${paymentStatus} for ${payment.clientName}.`,
            type: "payment",
            referenceId: payment._id,
            referenceModel: "Payment",
        },
        socketEvent,
        { payment }
    );

    // Receipt email — fire-and-forget, only on paid
    if (paymentStatus === "paid") {
        sendEmail({
            to: payment.clientEmail,
            subject: "Payment Receipt - SY Digital",
            html: paymentReceipt({
                name: payment.clientName,
                amount: payment.amount,
                paymentId: payment.transactionId || payment._id,
            }),
        }).catch((err) => logger.warn(`[Payment] Email error: ${err.message}`));
    }

    return payment;
};

const getPaymentStats = async () => {
    // Single $facet aggregation replaces 5 countDocuments + 1 aggregate (6 DB round-trips → 1)
    const [result] = await Payment.aggregate([
        {
            $facet: {
                counts: [
                    {
                        $group: {
                            _id: "$paymentStatus",
                            count: { $sum: 1 },
                        },
                    },
                ],
                revenue: [
                    { $match: { paymentStatus: "paid" } },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$amount" },
                        },
                    },
                ],
                totalPayments: [
                    { $count: "count" },
                ],
            },
        },
    ]);

    // Build counts map from facet result
    const countsMap = {};
    for (const { _id, count } of result.counts) {
        countsMap[_id] = count;
    }

    return {
        totalPayments: result.totalPayments[0]?.count ?? 0,
        pendingPayments: countsMap.pending ?? 0,
        paidPayments: countsMap.paid ?? 0,
        failedPayments: countsMap.failed ?? 0,
        refundedPayments: countsMap.refunded ?? 0,
        totalRevenue: result.revenue[0]?.total ?? 0,
    };
};

const getMonthlyPaymentAnalytics = async () => {
    // Default lookback: last 12 months — prevents full collection scan as data grows
    const since = new Date();
    since.setMonth(since.getMonth() - 12);

    return Payment.aggregate([
        {
            $match: {
                createdAt: { $gte: since },
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                totalPayments: { $sum: 1 },
                revenue: { $sum: "$amount" },
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                totalPayments: 1,
                revenue: 1,
            },
        },
    ]);
};

const getPaymentStatusAnalytics = async () => {
    return Payment.aggregate([
        {
            $group: {
                _id: "$paymentStatus",
                total: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                total: 1,
            },
        },
        {
            $sort: { status: 1 },
        },
    ]);
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePaymentStatus,
    getPaymentStats,
    getMonthlyPaymentAnalytics,
    getPaymentStatusAnalytics,
};

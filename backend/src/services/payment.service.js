const Payment = require("../models/Payment");
const Meeting = require("../models/Meeting");

const ApiError = require("../utils/ApiError");

const createPayment = async (paymentData) => {

    const meeting = await Meeting.findById(paymentData.meeting);

    if (!meeting) {

        throw new ApiError(

            404,

            "Meeting not found"

        );

    }

    const existingPayment = await Payment.findOne({

        meeting: paymentData.meeting,

        paymentStatus: {

            $in: [

                "pending",

                "paid"

            ]

        }

    });

    if (existingPayment) {

        throw new ApiError(

            409,

            "Payment already exists for this meeting"

        );

    }

    const payment = await Payment.create(paymentData);

    return payment;

};

const getAllPayments = async (query) => {

    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    if (query.paymentStatus) {

        filter.paymentStatus = query.paymentStatus;

    }

    const payments = await Payment.find(filter)
        .populate("meeting")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Payment.countDocuments(filter);

    return {

        payments,

        pagination: {

            total,

            page,

            limit,

            totalPages: Math.ceil(total / limit),

        },

    };

};

const getPaymentById = async (paymentId) => {

    const payment = await Payment.findById(paymentId)
        .populate("meeting");

    if (!payment) {

        throw new ApiError(

            404,

            "Payment not found"

        );

    }

    return payment;

};

const updatePaymentStatus = async (paymentId, paymentStatus) => {

    const payment = await Payment.findById(paymentId);

    if (!payment) {

        throw new ApiError(

            404,

            "Payment not found"

        );

    }

    payment.paymentStatus = paymentStatus;

    if (paymentStatus === "paid") {

        payment.paidAt = new Date();

    }

    await payment.save();

    return payment;

};

const getPaymentStats = async () => {

    const [

        totalPayments,

        pendingPayments,

        paidPayments,

        failedPayments,

        refundedPayments,

    ] = await Promise.all([

        Payment.countDocuments(),

        Payment.countDocuments({ paymentStatus: "pending" }),

        Payment.countDocuments({ paymentStatus: "paid" }),

        Payment.countDocuments({ paymentStatus: "failed" }),

        Payment.countDocuments({ paymentStatus: "refunded" }),

    ]);

    const totalRevenue = await Payment.aggregate([

        {
            $match: {
                paymentStatus: "paid",
            },
        },

        {
            $group: {
                _id: null,
                revenue: {
                    $sum: "$amount",
                },
            },
        },

    ]);

    return {

        totalPayments,

        pendingPayments,

        paidPayments,

        failedPayments,

        refundedPayments,

        totalRevenue:

            totalRevenue.length > 0

                ? totalRevenue[0].revenue

                : 0,

    };

};

const getMonthlyPaymentAnalytics = async () => {

    return await Payment.aggregate([

        {
            $group: {

                _id: {

                    month: {
                        $month: "$createdAt",
                    },

                    year: {
                        $year: "$createdAt",
                    },

                },

                totalPayments: {
                    $sum: 1,
                },

                revenue: {
                    $sum: "$amount",
                },

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

    return await Payment.aggregate([

        {
            $group: {

                _id: "$paymentStatus",

                total: {

                    $sum: 1,

                },

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
            $sort: {

                status: 1,

            },

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
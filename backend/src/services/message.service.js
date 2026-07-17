const Message = require("../models/Message");
const Service = require("../models/Service");
const ApiError = require("../utils/ApiError"); 

const createMessage = async (messageData) => {

    if (messageData.service) {

        const service = await Service.findById(messageData.service);

        if (!service) {

            throw new ApiError(
                404,
                "Service not found"
            );

        }

    }

    const message = await Message.create(messageData);

    return message;

};


const getAllMessages = async (query) => {

    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    if (query.status) {

        filter.status = query.status;

    }

    if (query.service) {

        filter.service = query.service;

    }

    const messages = await Message.find(filter)
        .populate("service", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Message.countDocuments(filter);

    return {

        messages,

        pagination: {

            total,

            page,

            limit,

            totalPages: Math.ceil(total / limit),

        },

    };

};

const getMessageById = async (id) => {

    const message = await Message.findById(id)
        .populate("service", "title");

    if (!message) {

        throw new ApiError(

            404,

            "Message not found"

        );

    }

    return message;

};

const updateMessageStatus = async (id, status) => {

    const message = await Message.findById(id);

    if (!message) {

        throw new ApiError(

            404,

            "Message not found"

        );

    }

    message.status = status;

    await message.save();

    return message;

};

const deleteMessage = async (id) => {

    const message = await Message.findById(id);

    if (!message) {

        throw new ApiError(

            404,

            "Message not found"

        );

    }

    await message.deleteOne();

};

const replyToMessage = async (messageId, reply, adminId) => {

    const message = await Message.findById(messageId);

    if (!message) {

        throw new ApiError(
            404,
            "Message not found"
        );

    }

    message.adminReply = reply;

    message.status = "replied";

    message.repliedAt = new Date();

    message.repliedBy = adminId;

    await message.save();

    return message;

};

const getMessageStats = async () => {

    const [

        totalMessages,

        unreadMessages,

        readMessages,

        repliedMessages,

        archivedMessages,

    ] = await Promise.all([

        Message.countDocuments(),

        Message.countDocuments({ status: "unread" }),

        Message.countDocuments({ status: "read" }),

        Message.countDocuments({ status: "replied" }),

        Message.countDocuments({ status: "archived" }),

    ]);

    return {

        totalMessages,

        unreadMessages,

        readMessages,

        repliedMessages,

        archivedMessages,

    };

};

const getMonthlyMessageAnalytics = async () => {

    const analytics = await Message.aggregate([

        {
            $group: {

                _id: {

                    year: { $year: "$createdAt" },

                    month: { $month: "$createdAt" },

                },

                totalMessages: {

                    $sum: 1,

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

                totalMessages: 1,

            },

        },

    ]);

    return analytics;

};

const getRecentMessages = async () => {

    return await Message.find()

        .populate("service", "title")

        .sort({

            createdAt: -1,

        })

        .limit(10)

        .select(

            "name email subject status service createdAt"

        );

};





module.exports = {

    createMessage,

    getAllMessages,

    getMessageById,

    updateMessageStatus,

    deleteMessage,

    replyToMessage,

    getMessageStats,

    getMonthlyMessageAnalytics,

    getRecentMessages,


};
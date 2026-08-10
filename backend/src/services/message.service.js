const { emitToAdmins, emitToClient } = require("../socket/socketEmitter");
const Message = require("../models/Message");
const User = require("../models/User");
const Service = require("../models/Service");
const ApiError = require("../utils/ApiError");
const logger = require("../middlewares/logger");

const { createNotification } = require("./notification.service");
const { sendEmail } = require("./email.service");
const contactReply = require("../emails/contactReply");
const adminAlert = require("../emails/adminAlert");

const getAdminEmail = () =>
    process.env.ADMIN_EMAIL || process.env.EMAIL_USER;


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
   

await message.populate("service", "title");

try {

    emitToAdmins("newMessage", {
        message,
    });

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}

createNotification({

    title: "New Contact Message",

    message: `${message.name} sent a new contact message.`,

    type: "message",

    referenceId: message._id,

    referenceModel: "Message",

}).catch((error) => logger.warn(`[Notification Service] ${error.message}`));

sendEmail({
    to: getAdminEmail(),
    subject: `New Contact Message from ${message.name}`,
    html: adminAlert({
        leadName: message.name,
        leadEmail: message.email,
        type: "Contact Message",
        details: [
            `Subject: ${message.subject}`,
            message.phone ? `Phone: ${message.phone}` : "",
            message.service?.title ? `Service: ${message.service.title}` : "",
            "",
            message.message,
        ]
            .filter(Boolean)
            .join("\n"),
    }),
}).catch((error) =>
    logger.warn(`[Message] Admin alert email failed: ${error.message}`)
);

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
    await message.populate("service", "title");

    try {

    await createNotification({

        title: "Message Status Updated",

        message: `${message.name}'s message marked as ${status}.`,

        type: "message",

        referenceId: message._id,

        referenceModel: "Message",

    });

} catch (error) {

    logger.warn(`[Notification Service] ${error.message}`);

}

try {

    emitToAdmins("messageStatusUpdated", {

        messageId: message._id,

        status,

        message,

    });

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}

try {

    const clientUser = await User.findOne({ email: message.email }).select("_id");

    if (clientUser) {

        emitToClient(clientUser._id, "messageStatusUpdated", { message });

    }

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}



    return message;

};

const deleteMessage = async (id) => {

    const message = await Message.findById(id);

    if (!message) {
        throw new ApiError(404, "Message not found");
    }

    await message.deleteOne();

    try {

        emitToAdmins("messageDeleted", {
            messageId: message._id,
        });

    } catch (error) {

        logger.warn(`[Socket.IO] ${error.message}`);

    }

    return message;

};

const replyToMessage = async (messageId, reply, adminId) => {

    const message = await Message.findById(messageId);

    if (!message) {

        throw new ApiError(
            404,
            "Message not found"
        );

    }

    const legacyAdminReply = message.adminReply;

    message.adminReply = reply;

    if (message.adminReplies.length === 0 && legacyAdminReply) {
        message.adminReplies.push({
            text: legacyAdminReply,
            repliedBy: message.repliedBy,
        });
    }

    message.adminReplies.push({ text: reply, repliedBy: adminId });

    message.status = "replied";

    message.repliedAt = new Date();

    message.repliedBy = adminId;

    await message.save();
    await message.populate("service", "title");

try {

    emitToAdmins("messageReplied", {

        message,

    });

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}

// Notification + client emit are fire-and-forget — never block the reply response
(async () => {
    try {

        const clientUser = await User.findOne({ email: message.email }).select("_id");

        if (clientUser) {

            createNotification({

                title: "Message Replied",

                message: "You received a reply to your message.",

                type: "message",

                referenceId: message._id,

                referenceModel: "Message",

                createdFor: clientUser._id,

            }).catch((error) => logger.warn(`[Notification Service] ${error.message}`));

            emitToClient(clientUser._id, "messageReplied", { message });

        }

    } catch (error) {

        logger.warn(`[Socket.IO] ${error.message}`);

    }
})();

// Send reply email (fire-and-forget — never block the reply or socket events)
sendEmail({

    to: message.email,

    subject: "Reply from SY Digital",

    html: contactReply({

        name: message.name,

        reply: message.adminReply,

    }),

}).catch((error) => logger.warn(`[Email Service] ${error.message}`));

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

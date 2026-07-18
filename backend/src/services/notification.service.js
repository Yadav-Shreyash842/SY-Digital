const { emitToAdmins } = require("../socket/socketEmitter");
const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");
const logger = require("../middlewares/logger");

const createNotification = async ({
    title,
    message,
    type,
    referenceId = null,
    referenceModel = null,
    createdFor = null,
}) => {

    const notification = await Notification.create({

        title,

        message,

        type,

        referenceId,

        referenceModel,

        createdFor,

    });

    try {

    emitToAdmins("newNotification", {
        notification,
    });

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}

    return notification;

};


const getAllNotifications = async (query) => {

    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    if (query.type) {

        filter.type = query.type;

    }

    if (query.isRead !== undefined) {

        filter.isRead = query.isRead === "true";

    }

    const notifications = await Notification.find(filter)

        .sort({ createdAt: -1 })

        .skip(skip)

        .limit(limit);

    const total = await Notification.countDocuments(filter);

    return {

        notifications,

        pagination: {

            total,

            page,

            limit,

            totalPages: Math.ceil(total / limit),

        },

    };

};



const getNotificationById = async (id) => {

    const notification = await Notification.findById(id);

    if (!notification) {

        throw new ApiError(

            404,

            "Notification not found"

        );

    }

    return notification;

}; 


const markNotificationAsRead = async (notificationId) => {

    const notification = await Notification.findById(notificationId);

    if (!notification) {

        throw new ApiError(
            404,
            "Notification not found"
        );

    }

    notification.isRead = true;
    
    await notification.save();

    try {

    emitToAdmins("notificationRead", {

        notificationId: notification._id,

        notification,

    });

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}


    return notification;

};


const markAllNotificationsAsRead = async () => {

    const result = await Notification.updateMany(

        {
            isRead: false,
        },

        {
            $set: {
                isRead: true,
            },
        }

    );

    try {

        emitToAdmins("allNotificationsRead", {});

    } catch (error) {

        logger.warn(`[Socket.IO] ${error.message}`);

    }

    return result;

};


const deleteNotification = async (notificationId) => {

    const notification = await Notification.findById(notificationId);

    if (!notification) {

        throw new ApiError(
            404,
            "Notification not found"
        );

    }
await notification.deleteOne();

try {

    emitToAdmins("notificationDeleted", {

        notificationId: notification._id,

    });

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}

return notification;

}; 

const getNotificationStats = async () => {

    const [

        totalNotifications,

        unreadNotifications,

        readNotifications,

    ] = await Promise.all([

        Notification.countDocuments(),

        Notification.countDocuments({

            isRead: false,

        }),

        Notification.countDocuments({

            isRead: true,

        }),

    ]);

    return {

        totalNotifications,

        unreadNotifications,

        readNotifications,

    };

};


const getNotificationTypeAnalytics = async () => {

    const analytics = await Notification.aggregate([

        {

            $group: {

                _id: "$type",

                total: {

                    $sum: 1,

                },

            },

        },

        {

            $project: {

                _id: 0,

                type: "$_id",

                total: 1,

            },

        },

        {

            $sort: {

                total: -1,

            },

        },

    ]);

    return analytics;

};


const getRecentNotifications = async () => {

    return await Notification.find()

        .sort({

            createdAt: -1,

        })

        .limit(10)

        .select(

            "title message type isRead createdAt"

        );

};


module.exports = {

    createNotification,

    getAllNotifications,

    getNotificationById,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    deleteNotification,

    getNotificationStats,

    getNotificationTypeAnalytics,

    getRecentNotifications,

};



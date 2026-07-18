const {

    getAllNotifications,

    getNotificationById,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    deleteNotification,

    getNotificationStats,

    getNotificationTypeAnalytics,

    getRecentNotifications,

} = require("../services/notification.service");

const ApiResponse = require("../utils/ApiResponse");

const getAll = async (req, res, next) => {

    try {

        const notifications = await getAllNotifications(req.query);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Notifications fetched successfully",

                notifications

            )

        );

    } catch (error) {

        next(error);

    }

}; 


const getById = async (req, res, next) => {

    try {

        const notification = await getNotificationById(req.params.id);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Notification fetched successfully",

                notification

            )

        );

    } catch (error) {

        next(error);

    }

}; 


const markAsRead = async (req, res, next) => {

    try {

        const notification = await markNotificationAsRead(
            req.params.id
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Notification marked as read",

                notification

            )

        );

    } catch (error) {

        next(error);

    }

}; 

const markAllAsRead = async (req, res, next) => {

    try {

        await markAllNotificationsAsRead();

        return res.status(200).json(

            new ApiResponse(

                200,

                "All notifications marked as read"

            )

        );

    } catch (error) {

        next(error);

    }

}; 


const remove = async (req, res, next) => {

    try {

        await deleteNotification(req.params.id);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Notification deleted successfully"

            )

        );

    } catch (error) {

        next(error);

    }

};

const stats = async (req, res, next) => {

    try {

        const statistics = await getNotificationStats();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Notification statistics fetched successfully",

                statistics

            )

        );

    } catch (error) {

        next(error);

    }

}; 


const typeAnalytics = async (req, res, next) => {

    try {

        const analytics = await getNotificationTypeAnalytics();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Notification type analytics fetched successfully",

                analytics

            )

        );

    } catch (error) {

        next(error);

    }

}; 

const recentNotifications = async (req, res, next) => {

    try {

        const notifications = await getRecentNotifications();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Recent notifications fetched successfully",

                notifications

            )

        );

    } catch (error) {

        next(error);

    }

}; 



module.exports = {

    getAll,

    getById,

    markAsRead,

    markAllAsRead,

    remove,

    stats,

    typeAnalytics,

    recentNotifications,

};
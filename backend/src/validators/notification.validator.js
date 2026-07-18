const { param, query } = require("express-validator");

/**
 * Validate Notification ID
 */
const notificationIdValidator = [

    param("id")
        .isMongoId()
        .withMessage("Invalid notification ID"),

];

/**
 * Get All Notifications Validator
 */
const getAllNotificationsValidator = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100")
        .toInt(),

    query("type")
        .optional()
        .isIn([
            "meeting",
            "payment",
            "review",
            "message",
            "user",
            "system",
        ])
        .withMessage("Invalid notification type"),

    query("isRead")
        .optional()
        .isBoolean()
        .withMessage("isRead must be true or false")
        .toBoolean(),

];

/**
 * Get Notification By ID
 */
const getNotificationValidator = [

    param("id")
        .isMongoId()
        .withMessage("Invalid notification ID"),

];

/**
 * Mark Single Notification as Read
 */
const markAsReadValidator = [

    param("id")
        .isMongoId()
        .withMessage("Invalid notification ID"),

];

/**
 * Delete Notification
 */
const deleteNotificationValidator = [

    param("id")
        .isMongoId()
        .withMessage("Invalid notification ID"),

];

module.exports = {

    getAllNotificationsValidator,

    getNotificationValidator,

    notificationIdValidator,

    markAsReadValidator,

    deleteNotificationValidator,

};
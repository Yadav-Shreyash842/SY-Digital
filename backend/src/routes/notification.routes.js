const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");

const authorize = require("../middlewares/authorize");

const validate = require("../middlewares/validate");

const ROLES = require("../constants/roles");

const {

   getAll,

    getById,

    markAsRead,

    markAllAsRead,

    remove,

    stats,

    typeAnalytics,

    recentNotifications

} = require("../controllers/notification.controller");

const {

    getAllNotificationsValidator,

    getNotificationValidator,

    markAsReadValidator,

    deleteNotificationValidator,

} = require("../validators/notification.validator");

// Static routes first — must come before /:id
router.patch(

    "/read-all",

    auth,

    authorize(ROLES.ADMIN),

    markAllAsRead

);

router.get(

    "/dashboard/stats",

    auth,

    authorize(ROLES.ADMIN),

    stats

);

router.get(

    "/dashboard/type-analytics",

    auth,

    authorize(ROLES.ADMIN),

    typeAnalytics

);

router.get(

    "/dashboard/recent",

    auth,

    authorize(ROLES.ADMIN),

    recentNotifications

);

router.get(

    "/",

    auth,

    authorize(ROLES.ADMIN),

    getAllNotificationsValidator,

    validate,

    getAll

);

// Dynamic routes last
router.get(

    "/:id",

    auth,

    authorize(ROLES.ADMIN),

    getNotificationValidator,

    validate,

    getById

);

router.patch(

    "/:id/read",

    auth,

    authorize(ROLES.ADMIN),

    markAsReadValidator,

    validate,

    markAsRead

);

router.delete(

    "/:id",

    auth,

    authorize(ROLES.ADMIN),

    deleteNotificationValidator,

    validate,

    remove

);

module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const ROLES = require("../constants/roles");

const {
    dashboardStats,
    recentMeetings,
    monthlyAnalytics,
    meetingStatusAnalytics,
    upcomingMeetings,
    recentActivities,
} = require("../controllers/dashboard.controller");

router.get(
    "/stats",
    auth,
    authorize(ROLES.ADMIN),
    dashboardStats
);

router.get(
    "/recent-meetings",
    auth,
    authorize(ROLES.ADMIN),
    recentMeetings
);

router.get(
    "/monthly-analytics",
    auth,
    authorize(ROLES.ADMIN),
    monthlyAnalytics
);

router.get(

    "/meeting-status",

    auth,

    authorize(ROLES.ADMIN),

    meetingStatusAnalytics

);

router.get(

    "/upcoming-meetings",

    auth,

    authorize(ROLES.ADMIN),

    upcomingMeetings

);

router.get(
    "/recent-activities",
    auth,
    authorize(ROLES.ADMIN),
    recentActivities
);

module.exports = router;
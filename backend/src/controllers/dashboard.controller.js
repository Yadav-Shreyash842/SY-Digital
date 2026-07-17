const { getDashboardStats , getRecentMeetings , getMonthlyMeetingAnalytics , getMeetingStatusAnalytics , getUpcomingMeetings , getRecentActivities  } = require("../services/dashboard.service");
const ApiResponse = require("../utils/ApiResponse");

const dashboardStats = async (req, res, next) => {
    try {
        const stats = await getDashboardStats();

        return res.status(200).json(
            new ApiResponse(
                200,
                "Dashboard statistics fetched successfully",
                stats
            )
        );
    } catch (error) {
        next(error);
    }
};

const recentMeetings = async (req, res, next) => {

    try {

        const meetings = await getRecentMeetings();

        return res.status(200).json(

            new ApiResponse(
                200,
                "Recent meetings fetched successfully",
                meetings
            )

        );

    } catch (error) {

        next(error);

    }

};

const monthlyAnalytics = async (req, res, next) => {

    try {

        const analytics = await getMonthlyMeetingAnalytics();

        return res.status(200).json(

            new ApiResponse(
                200,
                "Monthly meeting analytics fetched successfully",
                analytics
            )

        );

    } catch (error) {

        next(error);

    }

};

const meetingStatusAnalytics = async (req, res, next) => {

    try {

        const analytics = await getMeetingStatusAnalytics();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Meeting status analytics fetched successfully",

                analytics

            )

        );

    } catch (error) {

        next(error);

    }

};

const upcomingMeetings = async (req, res, next) => {

    try {

        const meetings = await getUpcomingMeetings();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Upcoming meetings fetched successfully",

                meetings

            )

        );

    } catch (error) {

        next(error);

    }

};

const recentActivities = async (req, res, next) => {

    try {

        const activities = await getRecentActivities();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Recent activities fetched successfully",

                activities

            )

        );

    } catch (error) {

        next(error);

    }

};

module.exports = {
    dashboardStats,
    recentMeetings,
    monthlyAnalytics,
    meetingStatusAnalytics,
    upcomingMeetings,
    recentActivities
};
   
    
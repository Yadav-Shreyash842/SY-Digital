const Meeting = require("../models/Meeting");

const getDashboardStats = async () => {

    const [
        totalMeetings,
        pendingMeetings,
        approvedMeetings,
        completedMeetings,
        cancelledMeetings,
        rejectedMeetings,
    ] = await Promise.all([

        Meeting.countDocuments(),

        Meeting.countDocuments({
            status: "pending",
        }),

        Meeting.countDocuments({
            status: "approved",
        }),

        Meeting.countDocuments({
            status: "completed",
        }),

        Meeting.countDocuments({
            status: "cancelled",
        }),

        Meeting.countDocuments({
            status: "rejected",
        }),

    ]);

    return {

        totalMeetings,

        pendingMeetings,

        approvedMeetings,

        completedMeetings,

        cancelledMeetings,

        rejectedMeetings,

    };

};

const getRecentMeetings = async () => {

    const meetings = await Meeting.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("service", "title")
        .select(
            "name email phone meetingDate meetingTime status service createdAt"
        );

    return meetings;

};

const getMonthlyMeetingAnalytics = async () => {

    const analytics = await Meeting.aggregate([

        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                totalMeetings: { $sum: 1 },
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
                totalMeetings: 1,
            },
        },

    ]);

    return analytics;

};

const getMeetingStatusAnalytics = async () => {

    const analytics = await Meeting.aggregate([

        {
            $group: {
                _id: "$status",
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

    return analytics;

};

const getUpcomingMeetings = async () => {

    const today = new Date();

    const meetings = await Meeting.find({

        meetingDate: { $gte: today },

        status: {
            $in: ["pending", "approved"]
        }

    })
        .sort({
            meetingDate: 1,
            meetingTime: 1,
        })
        .populate("service", "title")
        .select(
            "name email phone meetingDate meetingTime status service"
        );

    return meetings;

};

const getRecentActivities = async () => {

    const meetings = await Meeting.find()
        .sort({ updatedAt: -1 })
        .limit(10)
        .select("name email history");

    const activities = [];

    meetings.forEach((meeting) => {

        meeting.history.forEach((item) => {

            activities.push({

                meetingId: meeting._id,

                clientName: meeting.name,

                clientEmail: meeting.email,

                action: item.action,

                description: item.description,

                createdAt: item.createdAt,

            });

        });

    });

    activities.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return activities.slice(0, 20);

};

module.exports = {
    getDashboardStats,
    getRecentMeetings,
    getMonthlyMeetingAnalytics,
    getMeetingStatusAnalytics,
    getUpcomingMeetings,
    getRecentActivities,
};

   

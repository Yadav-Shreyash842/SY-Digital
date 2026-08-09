const PageView = require("../models/PageView");

function getDateRange(range) {
  const now = new Date();
  switch (range) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case "12m":
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

const getVisitorStats = async (range = "30d") => {
  const start = getDateRange(range);

  const [pageViews, uniqueVisitors, todayViews, todayVisitors] = await Promise.all([
    PageView.countDocuments({ createdAt: { $gte: start } }),
    PageView.distinct("sessionId", { createdAt: { $gte: start } }),
    PageView.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    PageView.distinct("sessionId", {
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
  ]);

  return {
    pageViews: pageViews || 0,
    uniqueVisitors: uniqueVisitors?.length || 0,
    todayPageViews: todayViews || 0,
    todayUniqueVisitors: todayVisitors?.length || 0,
  };
};

const getTraffic = async (range = "30d") => {
  const start = getDateRange(range);

  const data = await PageView.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        views: { $sum: 1 },
        uniqueSessions: { $addToSet: "$sessionId" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);

  return data.map((d) => ({
    date: `${d._id.year}-${String(d._id.month).padStart(2, "0")}-${String(d._id.day).padStart(2, "0")}`,
    views: d.views,
    uniqueVisitors: d.uniqueSessions?.length || 0,
  }));
};

module.exports = {
  getVisitorStats,
  getTraffic,
};

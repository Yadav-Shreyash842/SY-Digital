const PageView = require("../models/PageView");
const Message = require("../models/Message");
const ProjectRequest = require("../models/ProjectRequest");

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

  const [pageViews, uniqueVisitors, todayViews, todayVisitors, leads, bouncers, sessions] = await Promise.all([
    PageView.countDocuments({ createdAt: { $gte: start } }),
    PageView.distinct("sessionId", { createdAt: { $gte: start } }),
    PageView.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    PageView.distinct("sessionId", {
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    Promise.all([
      Message.countDocuments({ createdAt: { $gte: start } }),
      ProjectRequest.countDocuments({ createdAt: { $gte: start } }),
    ]),
    PageView.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: "$sessionId", views: { $sum: 1 } } },
      { $match: { views: { $eq: 1 } } },
      { $count: "count" },
    ]),
    PageView.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: "$sessionId", count: { $sum: 1 } } },
    ]),
  ]);

  const totalSessions = sessions?.length || 0;
  const uniqueVisitorCount = uniqueVisitors?.length || 0;
  const leadCount = (leads?.[0] || 0) + (leads?.[1] || 0);
  const singleViewSessions = bouncers?.[0]?.count || 0;

  return {
    pageViews: pageViews || 0,
    uniqueVisitors: uniqueVisitorCount,
    todayPageViews: todayViews || 0,
    todayUniqueVisitors: todayVisitors?.length || 0,
    conversionRate: uniqueVisitorCount > 0 ? Number(((leadCount / uniqueVisitorCount) * 100).toFixed(1)) : 0,
    bounceRate: totalSessions > 0 ? Number(((singleViewSessions / totalSessions) * 100).toFixed(1)) : 0,
    totalLeads: leadCount,
  };
};

const getTraffic = async (range = "30d") => {
  const start = getDateRange(range);

  const [views, leads] = await Promise.all([
    PageView.aggregate([
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
    ]),
    (async () => {
      const [messages, projectRequests] = await Promise.all([
        Message.aggregate([
          { $match: { createdAt: { $gte: start } } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
        ]),
        ProjectRequest.aggregate([
          { $match: { createdAt: { $gte: start } } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      const map = new Map();
      for (const item of messages) {
        const key = `${item._id.year}-${item._id.month}-${item._id.day}`;
        map.set(key, (map.get(key) || 0) + item.count);
      }
      for (const item of projectRequests) {
        const key = `${item._id.year}-${item._id.month}-${item._id.day}`;
        map.set(key, (map.get(key) || 0) + item.count);
      }
      return map;
    })(),
  ]);

  return views.map((d) => {
    const key = `${d._id.year}-${d._id.month}-${d._id.day}`;
    return {
      date: `${d._id.year}-${String(d._id.month).padStart(2, "0")}-${String(d._id.day).padStart(2, "0")}`,
      views: d.views,
      uniqueVisitors: d.uniqueSessions?.length || 0,
      conversions: leads.get(key) || 0,
    };
  });
};

module.exports = {
  getVisitorStats,
  getTraffic,
};

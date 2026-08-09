const analyticsService = require("../services/analytics.service");
const ApiResponse = require("../utils/ApiResponse");

const getVisitorStats = async (req, res, next) => {
  try {
    const range = req.query.range || "30d";
    const data = await analyticsService.getVisitorStats(range);
    return res.status(200).json(new ApiResponse(200, "Visitor stats fetched successfully", data));
  } catch (error) {
    next(error);
  }
};

const getTraffic = async (req, res, next) => {
  try {
    const range = req.query.range || "30d";
    const data = await analyticsService.getTraffic(range);
    return res.status(200).json(new ApiResponse(200, "Traffic data fetched successfully", data));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVisitorStats,
  getTraffic,
};

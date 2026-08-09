const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const { getVisitorStats, getTraffic } = require("../controllers/analytics.controller");

router.get("/visitor-stats", auth, authorize(ROLES.ADMIN), getVisitorStats);
router.get("/traffic", auth, authorize(ROLES.ADMIN), getTraffic);

module.exports = router;

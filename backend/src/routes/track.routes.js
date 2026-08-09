const express = require("express");
const router = express.Router();
const { trackPageView } = require("../controllers/track.controller");

router.post("/page-view", trackPageView);

module.exports = router;

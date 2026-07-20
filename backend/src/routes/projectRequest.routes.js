const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");
const { create, getAll, getById, updateStatus } = require("../controllers/projectRequest.controller");

// Admin routes
router.get("/", auth, authorize(ROLES.ADMIN), getAll);
router.get("/:id", auth, authorize(ROLES.ADMIN), getById);
router.patch("/:id/status", auth, authorize(ROLES.ADMIN), updateStatus);

module.exports = router;

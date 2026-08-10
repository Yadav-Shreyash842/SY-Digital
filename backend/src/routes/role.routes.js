const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = express.Router();

const {
    getAll,
} = require("../controllers/role.controller");

// All routes require admin authentication
router.use(auth, authorize(ROLES.ADMIN));

// Get all roles with live user counts
router.get("/", getAll);

module.exports = router;

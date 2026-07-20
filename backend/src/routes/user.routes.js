const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = express.Router();

const {
    getAll,
    getById,
    update,
    remove,
} = require("../controllers/user.controller");

// All routes require admin authentication
router.use(auth, authorize(ROLES.ADMIN));

// Get all users
router.get("/", getAll);

// Get user by ID
router.get("/:id", getById);

// Update user
router.patch("/:id", update);

// Delete user
router.delete("/:id", remove);

module.exports = router;

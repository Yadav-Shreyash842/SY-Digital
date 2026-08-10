const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = express.Router();

const {
    getAll,
    remove,
} = require("../controllers/media.controller");

// All routes require admin authentication
router.use(auth, authorize(ROLES.ADMIN));

// Get all media
router.get("/", getAll);

// Delete media
router.delete("/:id", remove);

module.exports = router;

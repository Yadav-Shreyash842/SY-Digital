const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = express.Router();

const {
    register,
    login,
    getProfile,
} = require("../controllers/auth.controller");

const {
    registerValidator,
    loginValidator,
} = require("../validators/auth.validator");

const validate = require("../middlewares/validate");

// Register
router.post(
    "/register",
    registerValidator,
    validate,
    register
);

// Login
router.post(
    "/login",
    loginValidator,
    validate,
    login
);

// Profile
router.get(
    "/profile",
    auth,
    getProfile
);

//admin
router.get(
    "/admin-test",
    auth,
    authorize(ROLES.ADMIN),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin"
        });
    }
);

module.exports = router;
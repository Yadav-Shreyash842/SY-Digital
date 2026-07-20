const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = express.Router();

const {
    register,
    login,
    getProfile,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
} = require("../controllers/auth.controller");

const {
    registerValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    updateProfileValidator,
    changePasswordValidator,
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

// Update profile
router.patch(
    "/profile",
    auth,
    updateProfileValidator,
    validate,
    updateProfile
);

// Change password
router.patch(
    "/change-password",
    auth,
    changePasswordValidator,
    validate,
    changePassword
);

// Forgot password
router.post(
    "/forgot-password",
    forgotPasswordValidator,
    validate,
    forgotPassword
);

// Reset password
router.post(
    "/reset-password",
    resetPasswordValidator,
    validate,
    resetPassword
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
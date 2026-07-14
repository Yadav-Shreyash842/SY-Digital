const express = require("express");

const router = express.Router();

const {
    register,
    login,
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

module.exports = router;
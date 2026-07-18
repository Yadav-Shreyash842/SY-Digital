const User = require("../models/User");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");

const { sendEmail } = require("./email.service");
const welcomeEmail = require("../emails/welcomeEmail");
const logger = require("../middlewares/logger");

// ==============================
// Register User
// ==============================
const registerUser = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        password,
    } = userData;

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
        email: normalizedEmail,
    })
        .select("_id")
        .lean();

    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email: normalizedEmail,
        password: hashedPassword,
    });

    // Send welcome email (don't fail registration if email fails)
    try {
        await sendEmail({
            to: user.email,
            subject: "Welcome to SY Digital 🚀",
            html: welcomeEmail(`${user.firstName} ${user.lastName}`),
        });
    } catch (error) {
        logger.error(`Welcome email failed: ${error.message}`);
    }

    return user.toJSON();
};

// ==============================
// Login User
// ==============================
const loginUser = async ({ email, password }) => {

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
        email: normalizedEmail,
    }).select(
        "+password firstName lastName email role isVerified avatar googleId createdAt updatedAt"
    );

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Compare password
    const isPasswordMatch = await comparePassword(
        password,
        user.password
    );

    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Convert document using schema transform
    const userResponse = user.toJSON();

    return {
        user: userResponse,
        token,
    };
};

module.exports = {
    registerUser,
    loginUser,
};
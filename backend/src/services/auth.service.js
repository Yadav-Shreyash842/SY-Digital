const User = require("../models/User");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");

const { sendEmail } = require("./email.service");
const welcomeEmail = require("../emails/welcomeEmail");
const passwordResetEmail = require("../emails/passwordReset");
const passwordResetSuccessEmail = require("../emails/passwordResetSuccess");
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

    // Send welcome email (fire-and-forget — don't block registration)
    sendEmail({
        to: user.email,
        subject: "Welcome to SY Digital",
        html: welcomeEmail(`${user.firstName} ${user.lastName}`),
    }).catch((error) => logger.error(`Welcome email failed: ${error.message}`));

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

// ==============================
// Forgot Password - Generate Reset Token
// ==============================
const forgotPassword = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        // Don't reveal whether user exists
        return { message: "If an account exists with this email, a reset link has been sent." };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateModifiedOnly: true });

    // Build reset URL
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    // Send email
    try {
        await sendEmail({
            to: user.email,
            subject: "Password Reset Request - SY Digital",
            html: passwordResetEmail(`${user.firstName} ${user.lastName}`, resetUrl),
        });
    } catch (error) {
        logger.error(`Password reset email failed: ${error.message}`);
        throw new ApiError(500, "Failed to send reset email");
    }

    return { message: "If an account exists with this email, a reset link has been sent." };
};

// ==============================
// Reset Password
// ==============================
const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    // Hash new password
    user.password = await hashPassword(newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateModifiedOnly: true });

    // Send confirmation email
    try {
        await sendEmail({
            to: user.email,
            subject: "Password Updated - SY Digital",
            html: passwordResetSuccessEmail(`${user.firstName} ${user.lastName}`),
        });
    } catch (error) {
        logger.error(`Password reset success email failed: ${error.message}`);
    }

    return { message: "Password updated successfully" };
};

// ==============================
// Update Profile
// ==============================
const updateProfile = async (userId, updateData) => {
    const allowedFields = ["firstName", "lastName", "phone", "avatar"];
    const updates = {};

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            updates[field] = updateData[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid fields to update");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user.toJSON();
};

// ==============================
// Change Password
// ==============================
const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select("+password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(400, "Current password is incorrect");
    }

    user.password = await hashPassword(newPassword);
    await user.save({ validateModifiedOnly: true });

    return { message: "Password changed successfully" };
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
};
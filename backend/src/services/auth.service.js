const User = require("../models/User");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");

const registerUser = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        password,
    } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    return user;
};

const loginUser = async ({ email, password }) => {

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");

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

    // Remove password before sending user
    user.password = undefined;

    return {
        user,
        token,
    };
};

module.exports = {
    registerUser,
    loginUser,
};
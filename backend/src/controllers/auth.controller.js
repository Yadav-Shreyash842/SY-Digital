const { registerUser, loginUser, forgotPassword, resetPassword, updateProfile, changePassword } = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");

const register = async (req, res, next) => {
    try {
        const result = await registerUser(req.body);

        return res.status(201).json(
            new ApiResponse(
                201,
                "User registered successfully",
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.body);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Login successful",
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        return res.status(200).json(
            new ApiResponse(
                200,
                "Profile fetched successfully",
                req.user
            )
        );
    } catch (error) {
        next(error);
    }
};

const forgotPasswordHandler = async (req, res, next) => {
    try {
        const result = await forgotPassword(req.body.email);

        return res.status(200).json(
            new ApiResponse(
                200,
                result.message,
                null
            )
        );
    } catch (error) {
        next(error);
    }
};

const resetPasswordHandler = async (req, res, next) => {
    try {
        const result = await resetPassword(req.body.token, req.body.password);

        return res.status(200).json(
            new ApiResponse(
                200,
                result.message,
                null
            )
        );
    } catch (error) {
        next(error);
    }
};

const updateProfileHandler = async (req, res, next) => {
    try {
        const result = await updateProfile(req.user._id, req.body);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Profile updated successfully",
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

const changePasswordHandler = async (req, res, next) => {
    try {
        const result = await changePassword(req.user._id, req.body.currentPassword, req.body.newPassword);

        return res.status(200).json(
            new ApiResponse(
                200,
                result.message,
                null
            )
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    forgotPassword: forgotPasswordHandler,
    resetPassword: resetPasswordHandler,
    updateProfile: updateProfileHandler,
    changePassword: changePasswordHandler,
};
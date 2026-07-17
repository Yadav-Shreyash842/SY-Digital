const { registerUser, loginUser } = require("../services/auth.service");
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

module.exports = {
    register,
    login,
    getProfile,
};
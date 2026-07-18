const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const logger = require("./logger");

const auth = async (req, res, next) => {
    try {
        // Read Authorization Header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new ApiError(
                401,
                "Authorization token is missing"
            );
        }

        // Check Bearer Token
        if (!authHeader.startsWith("Bearer ")) {
            throw new ApiError(
                401,
                "Invalid authorization format"
            );
        }

        // Extract Token
        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new ApiError(
                401,
                "Authorization token is missing"
            );
        }

        // Verify Token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find User
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            throw new ApiError(
                401,
                "User not found"
            );
        }

        // Attach User to Request
        req.user = user;

        next();

    } catch (error) {

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            logger.warn(`Authentication failed: ${error.message} — ${req.method} ${req.originalUrl}`);
            return next(
                new ApiError(
                    401,
                    "Invalid or expired token"
                )
            );
        }

        next(error);
    }
};

module.exports = auth;
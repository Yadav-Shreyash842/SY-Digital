const logger = require("./logger");

const errorHandler = (err, req, res, next) => {

    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
    });

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose Validation Error
    if (err.name === "ValidationError") {

        statusCode = 400;

        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");

    }

    // Invalid Mongo ObjectId
    if (err.name === "CastError") {

        statusCode = 400;

        message = "Invalid resource ID.";

    }

    // Duplicate Key Error
    if (err.code === 11000) {

        statusCode = 409;

        const field = Object.keys(err.keyValue)[0];

        message = `${field} already exists.`;

    }

    // JWT Error
    if (err.name === "JsonWebTokenError") {

        statusCode = 401;

        message = "Invalid authentication token.";

    }

    // JWT Expired
    if (err.name === "TokenExpiredError") {

        statusCode = 401;

        message = "Authentication token has expired.";

    }

    res.status(statusCode).json({

        success: false,

        statusCode,

        message,

        errors: err.errors || [],

        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),

    });

};

module.exports = errorHandler;
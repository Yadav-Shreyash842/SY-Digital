const { body } = require("express-validator");

const createReviewValidator = [

    body("clientName")
        .trim()
        .notEmpty()
        .withMessage("Client name is required"),

    body("clientEmail")
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),

    body("service")
        .notEmpty()
        .withMessage("Service ID is required")
        .isMongoId()
        .withMessage("Invalid Service ID"),

    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),

    body("review")
        .trim()
        .notEmpty()
        .withMessage("Review is required")
        .isLength({ min: 10 })
        .withMessage("Review must be at least 10 characters long"),

];

module.exports = {
    createReviewValidator,
};
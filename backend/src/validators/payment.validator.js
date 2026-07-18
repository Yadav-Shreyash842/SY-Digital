const { body } = require("express-validator");

const createPaymentValidator = [

    body("meeting")
        .notEmpty()
        .withMessage("Meeting ID is required")
        .isMongoId()
        .withMessage("Invalid Meeting ID"),

    body("clientName")
        .trim()
        .notEmpty()
        .withMessage("Client name is required")
        .isLength({ max: 100 })
        .withMessage("Client name cannot exceed 100 characters"),

    body("clientEmail")
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),

    body("amount")
        .isFloat({ min: 1 })
        .withMessage("Amount must be greater than 0")
        .toFloat(),

];

module.exports = {
    createPaymentValidator,
};
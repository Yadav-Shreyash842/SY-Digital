const { body } = require("express-validator");

const createMessageValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),

    body("subject")
        .trim()
        .notEmpty()
        .withMessage("Subject is required"),

    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ min: 10 })
        .withMessage("Message must be at least 10 characters long"),

    body("phone")
        .optional()
        .trim(),

    body("company")
        .optional()
        .trim(),

    body("service")
        .optional()
        .isMongoId()
        .withMessage("Invalid Service ID"),

    body("budget")
        .optional()
        .isNumeric()
        .withMessage("Budget must be a number"),

];

const replyMessageValidator = [

    body("adminReply")
        .trim()
        .notEmpty()
        .withMessage("Reply is required")
        .isLength({ min: 5 })
        .withMessage("Reply must be at least 5 characters long"),

];

module.exports = {
    createMessageValidator,
    replyMessageValidator,
};
const { body } = require("express-validator");

const aiChatValidator = [
    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ max: 2000 })
        .withMessage("Message must be at most 2000 characters"),

    body("history")
        .optional()
        .isArray()
        .withMessage("History must be an array"),
];

module.exports = { aiChatValidator }

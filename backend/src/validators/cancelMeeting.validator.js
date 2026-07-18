const { body } = require("express-validator");

const cancelMeetingValidator = [

    body("reason")
        .trim()
        .notEmpty()
        .withMessage("Cancellation reason is required")
        .isLength({ min: 10, max: 500 })
        .withMessage("Cancellation reason must be between 10 and 500 characters"),

];

module.exports = {
    cancelMeetingValidator,
};
const { body } = require("express-validator");

const rescheduleMeetingValidator = [

    body("meetingDate")
        .notEmpty()
        .withMessage("Meeting date is required")
        .isISO8601()
        .withMessage("Invalid meeting date"),

    body("meetingTime")
        .trim()
        .notEmpty()
        .withMessage("Meeting time is required"),

];

module.exports = {
    rescheduleMeetingValidator,
};
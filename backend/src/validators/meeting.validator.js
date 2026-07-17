const { body } = require("express-validator");

const meetingValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),

    body("service")
        .notEmpty()
        .withMessage("Service is required"),

    body("meetingDate")
        .notEmpty()
        .withMessage("Meeting date is required")
        .isISO8601()
        .withMessage("Invalid meeting date"),

    body("meetingTime")
        .trim()
        .notEmpty()
        .withMessage("Meeting time is required"),

    body("projectRequirements")
        .trim()
        .notEmpty()
        .withMessage("Project requirements are required"),

];

module.exports = {
    meetingValidator,
};
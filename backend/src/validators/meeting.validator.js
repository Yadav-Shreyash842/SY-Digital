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
        .withMessage("Phone number is required")
        .isMobilePhone("any")
        .withMessage("Please provide a valid phone number"),

    body("service")
        .notEmpty()
        .withMessage("Service is required")
        .isMongoId()
        .withMessage("Invalid service ID"),

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
        .withMessage("Project requirements are required")
        .isLength({ max: 5000 })
        .withMessage("Project requirements cannot exceed 5000 characters"),

];

module.exports = {
    meetingValidator,
};
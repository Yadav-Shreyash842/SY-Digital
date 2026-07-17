const { body } = require("express-validator");

const meetingStatusValidator = [

    body("status")
        .notEmpty()
        .withMessage("Meeting status is required")

        .isIn([
            "pending",
            "approved",
            "completed",
            "cancelled",
            "rejected",
        ])
        .withMessage("Invalid meeting status"),

];

module.exports = {
    meetingStatusValidator,
};

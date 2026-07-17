const { body } = require("express-validator");

const cancelMeetingValidator = [

    body("reason")
        .trim()
        .notEmpty()
        .withMessage("Cancellation reason is required"),

];

module.exports = {
    cancelMeetingValidator,
};
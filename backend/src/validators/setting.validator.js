const { body } = require("express-validator");

const updateSettingsValidator = [
    body("agencyName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Agency name must be between 2 and 100 characters"),

    body("supportEmail")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Please provide a valid support email")
        .normalizeEmail(),

    body("websiteUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage("Please provide a valid website URL"),

    body("pushNotifications")
        .optional()
        .isBoolean()
        .withMessage("pushNotifications must be a boolean"),

    body("emailNotifications")
        .optional()
        .isBoolean()
        .withMessage("emailNotifications must be a boolean"),

    body("marketingEmails")
        .optional()
        .isBoolean()
        .withMessage("marketingEmails must be a boolean"),

    body("sessionTimeout")
        .optional()
        .isInt({ min: 5, max: 1440 })
        .withMessage("Session timeout must be between 5 and 1440 minutes"),

    body("twoFactor")
        .optional()
        .isBoolean()
        .withMessage("twoFactor must be a boolean"),
];

module.exports = {
    updateSettingsValidator,
};

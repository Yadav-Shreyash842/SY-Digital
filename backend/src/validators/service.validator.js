const { body } = require("express-validator");

const serviceValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Service title is required")
        .isLength({ min: 3, max: 120 })
        .withMessage("Service title must be between 3 and 120 characters"),

    body("shortDescription")
        .trim()
        .notEmpty()
        .withMessage("Short description is required")
        .isLength({ max: 250 })
        .withMessage("Short description cannot exceed 250 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isLength({ max: 50 })
        .withMessage("Category cannot exceed 50 characters"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid number"),

];

module.exports = {
    serviceValidator,
};
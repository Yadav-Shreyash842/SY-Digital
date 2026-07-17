const { body } = require("express-validator");

const serviceValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Service title is required"),

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
        .withMessage("Category is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number"),

];

module.exports = {
    serviceValidator,
};
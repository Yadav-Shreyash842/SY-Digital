const { body } = require("express-validator");

const projectValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required")
        .isLength({ min: 3, max: 120 })
        .withMessage("Project title must be between 3 and 120 characters"),

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

];

module.exports = {
    projectValidator,
};
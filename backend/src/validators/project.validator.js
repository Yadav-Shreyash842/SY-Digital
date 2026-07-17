const { body } = require("express-validator");

const projectValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required"),

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

];

module.exports = {
    projectValidator,
};
const { body } = require("express-validator");

const blogValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Blog title is required")
        .isLength({ max: 120 })
        .withMessage("Blog title cannot exceed 120 characters"),

    body("shortDescription")
        .trim()
        .notEmpty()
        .withMessage("Short description is required")
        .isLength({ max: 250 })
        .withMessage("Short description cannot exceed 250 characters"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ max: 50000 })
        .withMessage("Content cannot exceed 50000 characters"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isLength({ max: 50 })
        .withMessage("Category cannot exceed 50 characters"),

    body("author")
        .trim()
        .notEmpty()
        .withMessage("Author name is required")
        .isLength({ max: 100 })
        .withMessage("Author name cannot exceed 100 characters"),

];

module.exports = {
    blogValidator,
};
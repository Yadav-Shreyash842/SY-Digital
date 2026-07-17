const { body } = require("express-validator");

const blogValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Blog title is required"),

    body("shortDescription")
        .trim()
        .notEmpty()
        .withMessage("Short description is required")
        .isLength({ max: 250 })
        .withMessage("Short description cannot exceed 250 characters"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("author")
        .trim()
        .notEmpty()
        .withMessage("Author name is required"),

];

module.exports = {
    blogValidator,
};
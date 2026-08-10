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

const updateBlogValidator = [

    body("title")
        .optional()
        .trim()
        .isLength({ max: 120 })
        .withMessage("Blog title cannot exceed 120 characters"),

    body("shortDescription")
        .optional()
        .trim()
        .isLength({ max: 250 })
        .withMessage("Short description cannot exceed 250 characters"),

    body("content")
        .optional()
        .trim()
        .isLength({ max: 50000 })
        .withMessage("Content cannot exceed 50000 characters"),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Category cannot exceed 50 characters"),

    body("author")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Author name cannot exceed 100 characters"),

    body("status")
        .optional()
        .isIn(["draft", "published", "archived"])
        .withMessage("Status must be draft, published, or archived"),

    body("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be a boolean"),

];

module.exports = {
    blogValidator,
    updateBlogValidator,
};
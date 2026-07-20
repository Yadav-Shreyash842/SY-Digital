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

const projectUpdateValidator = [

    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 120 })
        .withMessage("Project title must be between 3 and 120 characters"),

    body("shortDescription")
        .optional()
        .trim()
        .isLength({ max: 250 })
        .withMessage("Short description cannot exceed 250 characters"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Category cannot exceed 50 characters"),

    body("status")
        .optional()
        .isIn(["draft", "published", "archived"])
        .withMessage("Status must be draft, published, or archived"),

    body("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be a boolean"),

];

const bulkDeleteValidator = [

    body("ids")
        .isArray({ min: 1, max: 50 })
        .withMessage("Please provide between 1 and 50 project IDs"),

    body("ids.*")
        .isMongoId()
        .withMessage("Each ID must be a valid MongoDB ObjectId"),

];

const bulkStatusValidator = [

    body("ids")
        .isArray({ min: 1, max: 50 })
        .withMessage("Please provide between 1 and 50 project IDs"),

    body("ids.*")
        .isMongoId()
        .withMessage("Each ID must be a valid MongoDB ObjectId"),

    body("status")
        .isIn(["draft", "published", "archived"])
        .withMessage("Status must be draft, published, or archived"),

];

module.exports = {
    projectValidator,
    projectUpdateValidator,
    bulkDeleteValidator,
    bulkStatusValidator,
};
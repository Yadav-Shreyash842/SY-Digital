const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");

const ROLES = require("../constants/roles");

const {
    create,
    getAll,
    getOne,
    update,
    remove,
    getFeatured,
} = require("../controllers/blog.controller");

const {
    blogValidator,
} = require("../validators/blog.validator");

router.post(
    "/",
    auth,
    authorize(ROLES.ADMIN),
    blogValidator,
    validate,
    create
);

router.get(
    "/",
    getAll
);

router.get(
    "/featured",
    getFeatured
);

router.get(
    "/:slug",
    getOne
);

router.patch(
    "/:id",
    auth,
    authorize(ROLES.ADMIN),
    update
);

router.delete(
    "/:id",
    auth,
    authorize(ROLES.ADMIN),
    remove
);
module.exports = router;
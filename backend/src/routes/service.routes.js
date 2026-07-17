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
} = require("../controllers/service.controller");

const {
    serviceValidator,
} = require("../validators/service.validator");

router.post(
    "/",
    auth,
    authorize(ROLES.ADMIN),
    serviceValidator,
    validate,
    create
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

router.get(
    "/featured",
    getFeatured
);

module.exports = router;
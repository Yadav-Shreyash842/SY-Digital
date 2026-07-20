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
    bulkDelete,
    bulkUpdate,
    getStats,
} = require("../controllers/project.controller");

const {
    projectValidator,
    projectUpdateValidator,
    bulkDeleteValidator,
    bulkStatusValidator,
} = require("../validators/project.validator");

router.post(
    "/",
    auth,
    authorize(ROLES.ADMIN),
    projectValidator,
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
    "/stats",
    auth,
    authorize(ROLES.ADMIN),
    getStats
);

router.post(
    "/bulk-delete",
    auth,
    authorize(ROLES.ADMIN),
    bulkDeleteValidator,
    validate,
    bulkDelete
);

router.patch(
    "/bulk-status",
    auth,
    authorize(ROLES.ADMIN),
    bulkStatusValidator,
    validate,
    bulkUpdate
);

router.get(
    "/:slug",
    getOne
);

router.patch(
    "/:id",
    auth,
    authorize(ROLES.ADMIN),
    projectUpdateValidator,
    validate,
    update
);

router.delete(
    "/:id",
    auth,
    authorize(ROLES.ADMIN),
    remove
);

module.exports = router;
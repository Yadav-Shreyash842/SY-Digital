const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const ROLES = require("../constants/roles");

const router = express.Router();

const {

    create,

    getAll,

    getById,

    updateStatus,

    remove,

    reply,

    stats,

    monthlyAnalytics,

    recentMessages,

} = require("../controllers/message.controller");

const {
    createMessageValidator,
    replyMessageValidator,
} = require("../validators/message.validator");

// Static routes first — must come before /:id
router.get(

    "/dashboard/stats",

    auth,

    authorize(ROLES.ADMIN),

    stats

);

router.get(

    "/dashboard/monthly-analytics",

    auth,

    authorize(ROLES.ADMIN),

    monthlyAnalytics

);

router.get(

    "/dashboard/recent",

    auth,

    authorize(ROLES.ADMIN),

    recentMessages

);

router.post(

    "/",

    createMessageValidator,

    validate,

    create

);

router.get(

    "/",

    auth,

    authorize(ROLES.ADMIN),

    getAll

);

// Dynamic routes last
router.get(

    "/:id",

    auth,

    authorize(ROLES.ADMIN),

    getById

);

router.patch(

    "/:id/status",

    auth,

    authorize(ROLES.ADMIN),

    updateStatus

);

router.delete(

    "/:id",

    auth,

    authorize(ROLES.ADMIN),

    remove

);

router.patch(

    "/:id/reply",

    auth,

    authorize(ROLES.ADMIN),

    replyMessageValidator,

    validate,

    reply

);

module.exports = router;

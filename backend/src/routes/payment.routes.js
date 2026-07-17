const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");

const authorize = require("../middlewares/authorize");

const validate = require("../middlewares/validate");

const ROLES = require("../constants/roles");

const {

    create,

    getAll,

    getById,

    updateStatus,

    paymentStats,

    monthlyAnalytics,

    statusAnalytics,


} = require("../controllers/payment.controller");

const { createPaymentValidator,} = require("../validators/payment.validator");

router.post(

    "/",

    auth,

    authorize(ROLES.ADMIN),

    createPaymentValidator,

    validate,

    create

);

router.get(

    "/",

    auth,

    authorize(ROLES.ADMIN),

    getAll

);

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

router.get(

    "/dashboard/stats",

    auth,

    authorize(ROLES.ADMIN),

    paymentStats

);

router.get(

    "/dashboard/monthly-analytics",

    auth,

    authorize(ROLES.ADMIN),

    monthlyAnalytics

);

router.get(

    "/dashboard/status-analytics",

    auth,

    authorize(ROLES.ADMIN),

    statusAnalytics

);

module.exports = router;
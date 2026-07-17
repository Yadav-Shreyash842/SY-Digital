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

    update,

    remove,

    featured,

    stats,

    ratingAnalytics,

} = require("../controllers/review.controller");

const { createReviewValidator, } = require("../validators/review.validator");

router.post(

    "/",

    auth,

    authorize(ROLES.ADMIN),

    createReviewValidator,

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

    featured

);

router.get(

    "/dashboard/stats",

    auth,

    authorize(ROLES.ADMIN),

    stats

);

router.get(

    "/dashboard/rating-analytics",

    auth,

    authorize(ROLES.ADMIN),

    ratingAnalytics

);

module.exports = router;
const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const ROLES = require("../constants/roles");

const router = express.Router();

const {
    get,
    update,
} = require("../controllers/setting.controller");

const { updateSettingsValidator } = require("../validators/setting.validator");

router.get(
    "/",
    auth,
    authorize(ROLES.ADMIN),
    get
);

router.patch(
    "/",
    auth,
    authorize(ROLES.ADMIN),
    updateSettingsValidator,
    validate,
    update
);

module.exports = router;

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
    updateStatus,
    reschedule,
    cancel,
} = require("../controllers/meeting.controller");

const { meetingValidator } = require("../validators/meeting.validator");
const { meetingStatusValidator } = require("../validators/meetingStatus.validator");
const { rescheduleMeetingValidator} = require("../validators/rescheduleMeeting.validator");
const { cancelMeetingValidator } = require("../validators/cancelMeeting.validator");

router.post(
    "/",
    meetingValidator,
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

router.patch(
    "/:id/status",
    auth,
    authorize(ROLES.ADMIN),
    meetingStatusValidator,
    validate,
    updateStatus
);

router.patch(
    "/:id/reschedule",
    auth,
    authorize(ROLES.ADMIN),
    rescheduleMeetingValidator,
    validate,
    reschedule
);

router.patch(
    "/:id/cancel",
    auth,
    authorize(ROLES.ADMIN),
    cancelMeetingValidator,
    validate,
    cancel
);

module.exports = router; 
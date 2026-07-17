const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const uploadImage = require("../middlewares/uploadImage");
const uploadVideo = require("../middlewares/uploadVideo");

const {
    uploadImage: uploadImageController,
    uploadVideo: uploadVideoController,
} = require("../controllers/upload.controller");

// Image Upload
router.post(
    "/image",
    auth,
    authorize(ROLES.ADMIN),
    uploadImage.single("image"),
    uploadImageController
);

// Video Upload
router.post(
    "/video",
    auth,
    authorize(ROLES.ADMIN),
    uploadVideo.single("video"),
    uploadVideoController
);

module.exports = router;
const cloudinary = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");
const logger = require("../middlewares/logger");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a Multer memory-storage file to a base64 data URI.
 * Validates that buffer and mimetype are present before conversion.
 */
const toDataUri = (file) => {
    if (!file.buffer || !file.mimetype) {
        throw new ApiError(400, "Invalid file: missing buffer or mimetype.");
    }

    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

// ─── Service Functions ────────────────────────────────────────────────────────

const uploadImageService = async (file) => {
    if (!file) {
        throw new ApiError(400, "Image file is required.");
    }

    try {
        const result = await cloudinary.uploader.upload(toDataUri(file), {
            folder: "sy-digital/images",
            resource_type: "image",
        });

        return {
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        };

    } catch (error) {
        // Re-throw ApiError from toDataUri as-is
        if (error instanceof ApiError) throw error;

        logger.error(`[Upload] Image upload failed: ${error.message}`);
        throw new ApiError(502, "Image upload failed. Please try again.");
    }
};

const uploadVideoService = async (
    file,
    folder = "sy-digital/videos"
) => {
    if (!file) {
        throw new ApiError(400, "Video file is required.");
    }

    try {
        const result = await cloudinary.uploader.upload(toDataUri(file), {
            folder,
            resource_type: "video",
        });

        return {
            publicId: result.public_id,
            url: result.secure_url,
            duration: result.duration,
            format: result.format,
            bytes: result.bytes,
        };

    } catch (error) {
        // Re-throw ApiError from toDataUri as-is
        if (error instanceof ApiError) throw error;

        logger.error(`[Upload] Video upload failed: ${error.message}`);
        throw new ApiError(502, "Video upload failed. Please try again.");
    }
};

module.exports = {
    uploadImageService,
    uploadVideoService,
};

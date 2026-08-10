const cloudinary = require("../config/cloudinary");
const Media = require("../models/Media");
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

const saveMediaRecord = async ({ result, type, originalName, createdBy }) => {
    try {
        const media = await Media.create({
            publicId: result.publicId,
            url: result.url,
            originalName: originalName || "",
            type,
            format: result.format || "",
            bytes: result.bytes || 0,
            width: result.width || 0,
            height: result.height || 0,
            duration: result.duration || 0,
            createdBy,
        });

        result._id = media._id;
        result.mediaId = media._id;
    } catch (error) {
        logger.warn(`[Media] Failed to save media record: ${error.message}`);
    }

    return result;
};

// ─── Service Functions ────────────────────────────────────────────────────────

const uploadImageService = async (file, meta = {}) => {
    if (!file) {
        throw new ApiError(400, "Image file is required.");
    }

    try {
        const result = await cloudinary.uploader.upload(toDataUri(file), {
            folder: "sy-digital/images",
            resource_type: "image",
        });

        const payload = {
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        };

        return await saveMediaRecord({
            result: payload,
            type: "image",
            originalName: meta.originalName,
            createdBy: meta.createdBy,
        });

    } catch (error) {
        // Re-throw ApiError from toDataUri as-is
        if (error instanceof ApiError) throw error;

        logger.error(`[Upload] Image upload failed: ${error.message}`);
        throw new ApiError(502, "Image upload failed. Please try again.");
    }
};

const uploadVideoService = async (
    file,
    meta = {}
) => {
    if (!file) {
        throw new ApiError(400, "Video file is required.");
    }

    try {
        const result = await cloudinary.uploader.upload(toDataUri(file), {
            folder: "sy-digital/videos",
            resource_type: "video",
        });

        const payload = {
            publicId: result.public_id,
            url: result.secure_url,
            duration: result.duration,
            format: result.format,
            bytes: result.bytes,
        };

        return await saveMediaRecord({
            result: payload,
            type: "video",
            originalName: meta.originalName,
            createdBy: meta.createdBy,
        });

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

const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const Media = require("../models/Media");
const ApiError = require("../utils/ApiError");
const logger = require("../middlewares/logger");

const assertValidMediaId = (mediaId) => {
    if (!mongoose.isValidObjectId(mediaId)) {
        throw new ApiError(400, "Invalid media ID");
    }
};

const getAllMedia = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 24;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.type) {
        filter.type = query.type;
    }

    if (query.search) {
        filter.originalName = { $regex: query.search, $options: "i" };
    }

    const media = await Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Media.countDocuments(filter);

    return {
        media,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const deleteMedia = async (mediaId) => {
    assertValidMediaId(mediaId);

    const media = await Media.findById(mediaId);

    if (!media) {
        throw new ApiError(404, "Media not found");
    }

    if (media.publicId) {
        try {
            await cloudinary.uploader.destroy(media.publicId, {
                resource_type: media.type === "video" ? "video" : "image",
            });
        } catch (error) {
            logger.warn(`[Media] Cloudinary delete failed for ${media.publicId}: ${error.message}`);
        }
    }

    await media.deleteOne();

    return media;
};

module.exports = {
    getAllMedia,
    deleteMedia,
};

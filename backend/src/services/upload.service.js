const cloudinary = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");

const uploadImageService = async (file) => {

    if (!file) {
        throw new ApiError(400, "Image file is required.");
    }

    try {

        console.log("Uploader Exists:", !!cloudinary.uploader);

        const dataUri =
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(dataUri, {
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

        console.error("UPLOAD ERROR:");
        console.dir(error, { depth: null });

        throw error;

    }

};


const uploadVideoService = async (
    file,
    folder = "sy-digital/videos"
) => {

    if (!file) {
        throw new ApiError(
            400,
            "Video file is required."
        );
    }

    const dataUri =
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(
        dataUri,
        {
            folder,
            resource_type: "video",
        }
    );

    return {
        publicId: result.public_id,
        url: result.secure_url,
        duration: result.duration,
        format: result.format,
        bytes: result.bytes,
    };

};

module.exports = {
    uploadImageService,
    uploadVideoService,
};
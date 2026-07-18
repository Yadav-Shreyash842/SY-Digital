const {
    uploadImageService,
    uploadVideoService,
} = require("../services/upload.service");
const ApiResponse = require("../utils/ApiResponse");

const uploadImage = async (req, res, next) => {

    try {
        const result = await uploadImageService(req.file);

        return res.status(201).json(
            new ApiResponse(
                201,
                "Image uploaded successfully.",
                result
            )
        );

    } catch (error) {

        next(error);

    }

};


const uploadVideo = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await uploadVideoService(req.file);

        return res.status(201).json(

            new ApiResponse(

                201,

                "Video uploaded successfully.",

                result

            )

        );

    } catch (error) {

        next(error);

    }

};
module.exports = {
    uploadImage,
    uploadVideo,
};
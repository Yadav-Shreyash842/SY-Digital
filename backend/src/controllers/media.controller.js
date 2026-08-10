const { getAllMedia, deleteMedia } = require("../services/media.service");
const ApiResponse = require("../utils/ApiResponse");

const getAll = async (req, res, next) => {
    try {
        const result = await getAllMedia(req.query);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Media fetched successfully",
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await deleteMedia(req.params.id);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Media deleted successfully",
                null
            )
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    remove,
};

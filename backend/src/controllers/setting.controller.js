const { getSettings, updateSettings } = require("../services/setting.service");
const ApiResponse = require("../utils/ApiResponse");

const get = async (req, res, next) => {
    try {
        const settings = await getSettings();

        return res.status(200).json(
            new ApiResponse(
                200,
                "Settings fetched successfully",
                settings
            )
        );
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const settings = await updateSettings(req.body, req.user?._id);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Settings updated successfully",
                settings
            )
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    get,
    update,
};

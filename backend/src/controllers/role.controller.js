const { getRoles } = require("../services/role.service");
const ApiResponse = require("../utils/ApiResponse");

const getAll = async (req, res, next) => {
    try {
        const roles = await getRoles();

        return res.status(200).json(
            new ApiResponse(
                200,
                "Roles fetched successfully",
                roles
            )
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
};

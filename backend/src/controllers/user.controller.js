const { getAllUsers, getUserById, updateUser, deleteUser } = require("../services/user.service");
const ApiResponse = require("../utils/ApiResponse");

const getAll = async (req, res, next) => {
    try {
        const result = await getAllUsers(req.query);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Users fetched successfully",
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const result = await getUserById(req.params.id);

        return res.status(200).json(
            new ApiResponse(
                200,
                "User fetched successfully",
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await updateUser(req.params.id, req.body);

        return res.status(200).json(
            new ApiResponse(
                200,
                "User updated successfully",
                result
            )
        );
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await deleteUser(req.params.id);

        return res.status(200).json(
            new ApiResponse(
                200,
                "User deleted successfully",
                null
            )
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    update,
    remove,
};

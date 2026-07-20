const { createService , getAllServices , getServiceBySlug , updateService , deleteService , getFeaturedServices , getServiceStats} = require("../services/service.service");
const ApiResponse = require("../utils/ApiResponse");

const create = async (req, res, next) => {

    try {

        const service = await createService(
            req.body,
            req.user._id
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                "Service created successfully",
                service
            )
        );

    } catch (error) {

        next(error);

    }

};


const getAll = async (req, res, next) => {

    try {

        const result = await getAllServices(req.query);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Services fetched successfully",

                result

            )

        );

    } catch (error) {

        next(error);

    }

};


const getOne = async (req, res, next) => {

    try {

        const service = await getServiceBySlug(
            req.params.slug
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Service fetched successfully",

                service

            )

        );

    } catch (error) {

        next(error);

    }

};

const update = async (req, res, next) => {

    try {

        const service = await updateService(
            req.params.id,
            req.body
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Service updated successfully",

                service

            )

        );

    } catch (error) {

        next(error);

    }

};

const remove = async (req, res, next) => {

    try {

        const service = await deleteService(
            req.params.id
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Service deleted successfully",

                service

            )

        );

    } catch (error) {

        next(error);

    }

};

const getFeatured = async (req, res, next) => {

    try {

        const services = await getFeaturedServices();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Featured services fetched successfully",

                services

            )

        );

    } catch (error) {

        next(error);

    }

};

const getStats = async (req, res, next) => {
    try {
        const stats = await getServiceStats();
        return res.status(200).json(
            new ApiResponse(200, "Service stats fetched successfully", stats)
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove,
    getFeatured,
    getStats,
};

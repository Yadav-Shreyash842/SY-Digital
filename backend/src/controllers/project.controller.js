const { createProject, getAllProjects , getProjectBySlug, updateProject , deleteProject, getFeaturedProjects } = require("../services/project.service");
const ApiResponse = require("../utils/ApiResponse");

const create = async (req, res, next) => {

    try {

        const project = await createProject(
            req.body,
            req.user._id
        );

        return res.status(201).json(

            new ApiResponse(

                201,

                "Project created successfully",

                project

            )

        );

    } catch (error) {

        next(error);

    }

};

const getAll = async (req, res, next) => {

    try {

        const result = await getAllProjects(req.query);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Projects fetched successfully",

                result

            )

        );

    } catch (error) {

        next(error);

    }

};

const getOne = async (req, res, next) => {

    try {

        const project = await getProjectBySlug(
            req.params.slug
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Project fetched successfully",

                project

            )

        );

    } catch (error) {

        next(error);

    }

};


const update = async (req, res, next) => {

    try {

        const project = await updateProject(
            req.params.id,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Project updated successfully",
                project
            )
        );

    } catch (error) {

        next(error);

    }

};

const remove = async (req, res, next) => {

    try {

        const project = await deleteProject(
            req.params.id
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Project deleted successfully",

                project

            )

        );

    } catch (error) {

        next(error);

    }

};

const getFeatured = async (req, res, next) => {

    try {

        const projects = await getFeaturedProjects();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Featured projects fetched successfully",

                projects

            )

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
};


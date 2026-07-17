const { createBlog , getAllBlogs , getBlogBySlug, updateBlog , deleteBlog , getFeaturedBlogs } = require("../services/blog.service");
const ApiResponse = require("../utils/ApiResponse");

const create = async (req, res, next) => {

    try {

        const blog = await createBlog(
            req.body,
            req.user._id
        );

        return res.status(201).json(

            new ApiResponse(

                201,

                "Blog created successfully",

                blog

            )

        );

    } catch (error) {

        next(error);

    }

};

const getAll = async (req, res, next) => {

    try {

        const result = await getAllBlogs(req.query);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Blogs fetched successfully",

                result

            )

        );

    } catch (error) {

        next(error);

    }

};

const getOne = async (req, res, next) => {

    try {

        const blog = await getBlogBySlug(
            req.params.slug
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Blog fetched successfully",

                blog

            )

        );

    } catch (error) {

        next(error);

    }

};

const update = async (req, res, next) => {

    try {

        const blog = await updateBlog(
            req.params.id,
            req.body
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Blog updated successfully",

                blog

            )

        );

    } catch (error) {

        next(error);

    }

};

const remove = async (req, res, next) => {

    try {

        const blog = await deleteBlog(
            req.params.id
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Blog deleted successfully",

                blog

            )

        );

    } catch (error) {

        next(error);

    }

};

const getFeatured = async (req, res, next) => {

    try {

        const blogs = await getFeaturedBlogs();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Featured blogs fetched successfully",

                blogs

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
const {

    createReview,

    getAllReviews,

    getReviewById,

    updateReview,

    deleteReview,

    getFeaturedReviews,

    getReviewStats,

    getRatingAnalytics,

} = require("../services/review.service");

const ApiResponse = require("../utils/ApiResponse");



const create = async (req, res, next) => {

    try {

        const review = await createReview(req.body);

        return res.status(201).json(

            new ApiResponse(

                201,

                "Review submitted successfully",

                review

            )

        );

    } catch (error) {

        next(error);

    }

};

const getAll = async (req, res, next) => {

    try {

        const reviews = await getAllReviews(req.query);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Reviews fetched successfully",

                reviews

            )

        );

    } catch (error) {

        next(error);

    }

}; 

const getById = async (req, res, next) => {

    try {

        const review = await getReviewById(req.params.id);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Review fetched successfully",

                review

            )

        );

    } catch (error) {

        next(error);

    }

};

const update = async (req, res, next) => {

    try {

        const review = await updateReview(

            req.params.id,

            req.body

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Review updated successfully",

                review

            )

        );

    } catch (error) {

        next(error);

    }

}; 

const remove = async (req, res, next) => {

    try {

        await deleteReview(req.params.id);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Review deleted successfully"

            )

        );

    } catch (error) {

        next(error);

    }

}; 

const featured = async (req, res, next) => {

    try {

        const reviews = await getFeaturedReviews();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Featured reviews fetched successfully",

                reviews

            )

        );

    } catch (error) {

        next(error);

    }

};

const stats = async (req, res, next) => {

    try {

        const statistics = await getReviewStats();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Review statistics fetched successfully",

                statistics

            )

        );

    } catch (error) {

        next(error);

    }

}; 

const ratingAnalytics = async (req, res, next) => {

    try {

        const analytics = await getRatingAnalytics();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Rating analytics fetched successfully",

                analytics

            )

        );

    } catch (error) {

        next(error);

    }

};




module.exports = {

    create,

    getAll,

    getById,

    update,

    remove,

    featured,

    stats,

    ratingAnalytics,

};
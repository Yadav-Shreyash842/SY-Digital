const mongoose = require("mongoose");
const { emitToAdmins } = require("../socket/socketEmitter");
const Review = require("../models/Review");
const Service = require("../models/Service");
const ApiError = require("../utils/ApiError");
const logger = require("../middlewares/logger");

const { createNotification } = require("./notification.service");

const { sendEmail } = require("./email.service");
const reviewApproved = require("../emails/reviewApproved");

const assertValidReviewId = (reviewId) => {
    if (!mongoose.isValidObjectId(reviewId)) {
        throw new ApiError(400, "Invalid review ID");
    }
};

const createReview = async (reviewData) => {

    if (!mongoose.isValidObjectId(reviewData.service)) {
        throw new ApiError(400, "Invalid service ID");
    }

    const service = await Service.findById(reviewData.service);

    if (!service) {

        throw new ApiError(
            404,
            "Service not found"
        );

    }

    const review = await Review.create(reviewData);
    await review.populate("service", "title");

    try {

        await createNotification({

            title: "New Review Submitted",

            message: `${review.clientName} submitted a ${review.rating}-star review.`,

            type: "review",

            referenceId: review._id,

            referenceModel: "Review",

        });

    } catch (error) {

        logger.warn(`[Notification Service] ${error.message}`);

    }

    try {

    emitToAdmins("reviewSubmitted", {
        review,
    });

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}

    return review;

};

const getAllReviews = async (query) => {

    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    if (query.status) {

        filter.status = query.status;

    }

    if (query.featured !== undefined) {

        filter.featured = query.featured === "true";

    }

    const reviews = await Review.find(filter)
        .populate("service", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Review.countDocuments(filter);

    return {

        reviews,

        pagination: {

            total,

            page,

            limit,

            totalPages: Math.ceil(total / limit),

        },

    };

};

const getReviewById = async (reviewId) => {

    assertValidReviewId(reviewId);

    const review = await Review.findById(reviewId)
        .populate("service", "title");

    if (!review) {

        throw new ApiError(

            404,

            "Review not found"

        );

    }

    return review;

};

const updateReview = async (reviewId, updateData) => {

    assertValidReviewId(reviewId);

    const review = await Review.findById(reviewId);

    if (!review) {

        throw new ApiError(
            404,
            "Review not found"
        );

    }

    Object.assign(review, updateData);

    await review.save();
    await review.populate("service", "title");

    try {

    await createNotification({

        title: "Review Updated",

        message: `${review.clientName}'s review status changed to ${review.status}.`,

        type: "review",

        referenceId: review._id,

        referenceModel: "Review",

    });

} catch (error) {

    logger.warn(`[Notification Service] ${error.message}`);

}

    // Send email only when review is approved
    try {

        if (review.status === "approved") {

            await sendEmail({

                to: review.clientEmail,

                subject: "Your Review Has Been Approved - SY Digital",

                html: reviewApproved(

                    review.clientName

                ),

            });

        }

    } catch (error) {

        logger.warn(`[Email Service] ${error.message}`);

    }
    try {

    switch (review.status) {

        case "approved":

            emitToAdmins("reviewApproved", {
                review,
            });

            break;

        case "rejected":

            emitToAdmins("reviewRejected", {
                review,
            });

            break;

        default:

            emitToAdmins("reviewUpdated", {
                review,
            });

    }

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}

    return review;

};

const deleteReview = async (reviewId) => {

    assertValidReviewId(reviewId);

    const review = await Review.findById(reviewId);

    if (!review) {

        throw new ApiError(

            404,

            "Review not found"

        );

    }

   await review.deleteOne();

try {

    emitToAdmins("reviewDeleted", {
        reviewId: review._id,
    });

} catch (error) {

    logger.warn(`[Socket.IO] ${error.message}`);

}

return review;

};

const getFeaturedReviews = async () => {

    return await Review.find({

        featured: true,

        status: "approved",

    })
        .populate("service", "title")
        .sort({ createdAt: -1 });

};

const getReviewStats = async () => {

    const [

        totalReviews,

        approvedReviews,

        pendingReviews,

        rejectedReviews,

    ] = await Promise.all([

        Review.countDocuments(),

        Review.countDocuments({

            status: "approved",

        }),

        Review.countDocuments({

            status: "pending",

        }),

        Review.countDocuments({

            status: "rejected",

        }),

    ]);

    const averageRating = await Review.aggregate([

        {

            $match: {

                status: "approved",

            },

        },

        {

            $group: {

                _id: null,

                averageRating: {

                    $avg: "$rating",

                },

            },

        },

    ]);

    return {

        totalReviews,

        approvedReviews,

        pendingReviews,

        rejectedReviews,

        averageRating:

            averageRating.length > 0

                ? Number(averageRating[0].averageRating.toFixed(1))

                : 0,

    };

};

const getRatingAnalytics = async () => {

    return await Review.aggregate([

        {

            $group: {

                _id: "$rating",

                total: {

                    $sum: 1,

                },

            },

        },

        {

            $project: {

                _id: 0,

                rating: "$_id",

                total: 1,

            },

        },

        {

            $sort: {

                rating: -1,

            },

        },

    ]);

};




module.exports = {

    createReview,

    getAllReviews,

    getReviewById,

    updateReview,

    deleteReview,

    getFeaturedReviews,

    getReviewStats,

    getRatingAnalytics,

};
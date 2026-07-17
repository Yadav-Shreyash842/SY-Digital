const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        clientName: {
            type: String,
            required: true,
            trim: true,
        },

        clientEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        company: {
            type: String,
            trim: true,
        },

        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        review: {
            type: String,
            required: true,
            trim: true,
        },

        profileImage: {
            type: String,
            default: null,
        },

        featured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
            ],
            default: "pending",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Review", reviewSchema);
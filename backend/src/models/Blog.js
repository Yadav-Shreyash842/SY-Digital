const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        shortDescription: {
            type: String,
            required: true,
            trim: true,
            maxlength: 250,
        },

        content: {
            type: String,
            required: true,
        },

        featuredImage: {
            publicId: {
                type: String,
                default: "",
            },
            url: {
                type: String,
                default: "",
            },
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        author: {
            type: String,
            required: true,
            trim: true,
        },

        readTime: {
            type: Number,
            default: 5,
        },

        views: {
            type: Number,
            default: 0,
        },

        seoTitle: {
            type: String,
            default: "",
            trim: true,
        },

        seoDescription: {
            type: String,
            default: "",
            trim: true,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: [
                "draft",
                "published",
                "archived",
            ],
            default: "draft",
        },

        publishedAt: {
            type: Date,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Blog",
    blogSchema
);
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
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

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        clientName: {
            type: String,
            default: "",
            trim: true,
        },

        technologies: [
            {
                type: String,
                trim: true,
            },
        ],

        images: [
            {
                publicId: String,
                url: String,
            },
        ],

        video: {
            publicId: String,
            url: String,
        },

        githubUrl: {
            type: String,
            default: "",
            trim: true,
        },

        liveUrl: {
            type: String,
            default: "",
            trim: true,
        },

        completionDate: {
            type: Date,
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
    "Project",
    projectSchema
);
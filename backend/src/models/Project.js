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
        publicId: {
            type: String,
            default: "",
        },
        url: {
            type: String,
            default: "",
        },
    },
],

       video: {
    publicId: {
        type: String,
        default: "",
    },
    url: {
        type: String,
        default: "",
    },
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

        revenue: {
            type: Number,
            default: 0,
            min: 0,
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

projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ isFeatured: 1 });
projectSchema.index({ createdBy: 1 });

projectSchema.index({
    title: "text",
    shortDescription: "text",
    description: "text",
    clientName: "text",
});

projectSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model(
    "Project",
    projectSchema
);
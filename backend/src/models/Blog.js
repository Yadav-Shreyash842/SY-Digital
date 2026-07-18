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
    trim: true,
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
    min: 1,
},


views: {
    type: Number,
    default: 0,
    min: 0,
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

blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ isFeatured: 1 });
blogSchema.index({ createdBy: 1 });
blogSchema.index({ publishedAt: -1 });

blogSchema.index({
    title: "text",
    shortDescription: "text",
    content: "text",
    seoTitle: "text",
    seoDescription: "text",
});

blogSchema.index({
    status: 1,
    isFeatured: 1,
});

blogSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Blog", blogSchema);


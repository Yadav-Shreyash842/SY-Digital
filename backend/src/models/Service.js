const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
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

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPrice: {
            type: Number,
            default: 0,
            min: 0,
        },

        duration: {
            type: String,
            default: "",
        },

        technologies: [
            {
                type: String,
                trim: true,
            },
        ],

        features: [
            {
                type: String,
                trim: true,
            },
        ],

       image: {
    publicId: {
        type: String,
        default: "",
    },
    url: {
        type: String,
        default: "",
    },
},

        isFeatured: {
            type: Boolean,
            default: false,
        },

        revenue: {
            type: Number,
            default: 0,
            min: 0,
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        bookings: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ["draft", "published", "archived"],
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

serviceSchema.index({ category: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ createdBy: 1 });

serviceSchema.index({
    title: "text",
    shortDescription: "text",
    description: "text",
});

serviceSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Service", serviceSchema);
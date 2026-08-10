const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            trim: true,
            default: "",
        },

        url: {
            type: String,
            trim: true,
            default: "",
        },

        originalName: {
            type: String,
            trim: true,
            default: "",
        },

        type: {
            type: String,
            enum: ["image", "video", "document"],
            default: "image",
        },

        format: {
            type: String,
            trim: true,
            default: "",
        },

        bytes: {
            type: Number,
            default: 0,
        },

        width: {
            type: Number,
            default: 0,
        },

        height: {
            type: Number,
            default: 0,
        },

        duration: {
            type: Number,
            default: 0,
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

mediaSchema.index({ type: 1 });
mediaSchema.index({ createdAt: -1 });

mediaSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Media", mediaSchema);

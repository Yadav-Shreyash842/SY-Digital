const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "meeting",
                "payment",
                "review",
                "message",
                "user",
                "system",
            ],
            required: true,
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        referenceModel: {
            type: String,
            enum: [
                "Meeting",
                "Payment",
                "Review",
                "Message",
                "User",
            ],
            default: null,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        createdFor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ createdFor: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

notificationSchema.index({
    createdFor: 1,
    isRead: 1,
});

notificationSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);
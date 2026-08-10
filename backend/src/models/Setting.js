const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
    {
        agencyName: {
            type: String,
            trim: true,
            default: "SY Digital",
        },

        supportEmail: {
            type: String,
            lowercase: true,
            trim: true,
            default: "hello@sydigital.com",
        },

        websiteUrl: {
            type: String,
            trim: true,
            default: "https://sydigital.com",
        },

        pushNotifications: {
            type: Boolean,
            default: true,
        },

        emailNotifications: {
            type: Boolean,
            default: true,
        },

        marketingEmails: {
            type: Boolean,
            default: false,
        },

        sessionTimeout: {
            type: Number,
            min: 5,
            max: 1440,
            default: 30,
        },

        twoFactor: {
            type: Boolean,
            default: false,
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

settingSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Setting", settingSchema);

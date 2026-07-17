const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
    {
        // Client Information
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        // Selected Service
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },

        // Meeting Details
        meetingType: {
            type: String,
            enum: [
                "online",
                "offline",
            ],
            default: "online",
        },

        meetingDate: {
            type: Date,
            required: true,
        },

        meetingTime: {
            type: String,
            required: true,
        },

        duration: {
            type: Number,
            default: 30,
        },

        // Project Information
        projectRequirements: {
            type: String,
            required: true,
            trim: true,
        },

        budget: {
            type: Number,
            default: 0,
        },

        // Online Meeting
        meetingLink: {
            type: String,
            default: "",
        },

        // Offline Meeting
        officeAddress: {
            type: String,
            default: "",
        },

        // Meeting Status
        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "completed",
                "cancelled",
                "rejected",
            ],
            default: "pending",
        },

        adminNotes: {
            type: String,
            default: "",
        },

        cancellationReason: {
            type: String,
            default: "",
        },

        cancelledAt: {
            type: Date,
            default: null,
        },

        history: [
    {
        action: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Meeting",
    meetingSchema
);
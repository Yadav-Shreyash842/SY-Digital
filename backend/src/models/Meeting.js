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
    min: 15,
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
    trim: true,
    default: "",
},

        // Offline Meeting
       officeAddress: {
    type: String,
    trim: true,
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
    trim: true,
    default: "",
},

       cancellationReason: {
    type: String,
    trim: true,
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
    enum: [
        "created",
        "approved",
        "completed",
        "cancelled",
        "rejected",
        "updated",
    ],
    required: true,
},

        description: {
            type: String,
            trim: true,
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

meetingSchema.index({ status: 1 });
meetingSchema.index({ meetingDate: 1 });
meetingSchema.index({ service: 1 });
meetingSchema.index({ createdBy: 1 });

meetingSchema.index({
    status: 1,
    meetingDate: 1,
});

meetingSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Meeting", meetingSchema);
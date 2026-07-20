const mongoose = require("mongoose");

const projectRequestSchema = new mongoose.Schema(
    {
        clientName: { type: String, required: true, trim: true },
        clientEmail: { type: String, required: true, lowercase: true, trim: true },
        title: { type: String, required: true, trim: true, maxlength: 120 },
        description: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        budget: { type: Number, default: 0, min: 0 },
        timeline: { type: String, trim: true, default: "" },
        status: {
            type: String,
            enum: ["pending", "reviewing", "approved", "rejected"],
            default: "pending",
        },
        adminNotes: { type: String, trim: true, default: "" },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null,
        },
    },
    { timestamps: true }
);

projectRequestSchema.index({ status: 1, createdAt: -1 });
projectRequestSchema.index({ clientEmail: 1 });

projectRequestSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("ProjectRequest", projectRequestSchema);

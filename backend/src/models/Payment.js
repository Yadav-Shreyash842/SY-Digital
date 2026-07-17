const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(

    {

        meeting: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meeting",
            required: true,
        },

        clientName: {
            type: String,
            required: true,
            trim: true,
        },

        clientEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
        },

        paymentMethod: {
            type: String,
            enum: [
                "razorpay",
                "stripe",
                "cash",
                "bank-transfer",
            ],
            default: "razorpay",
        },

        transactionId: {
            type: String,
            default: null,
        },

        orderId: {
            type: String,
            default: null,
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded",
            ],
            default: "pending",
        },

        notes: {
            type: String,
            trim: true,
        },

        paidAt: {
            type: Date,
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

module.exports = mongoose.model("Payment", paymentSchema);
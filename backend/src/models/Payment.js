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
    uppercase: true,
    trim: true,
    enum: ["INR", "USD", "EUR"],
    default: "INR",
},

      paymentMethod: {
    type: String,
    trim: true,
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
    trim: true,
    unique: true,
    sparse: true,
    default: null,
},

       orderId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
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
    default: "",
},

       paidAt: {
    type: Date,
    default: null,
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

paymentSchema.index({ meeting: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ createdBy: 1 });
paymentSchema.index({ paidAt: 1 });

paymentSchema.index({
    paymentStatus: 1,
    paidAt: -1,
});

paymentSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Payment", paymentSchema);
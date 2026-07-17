const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(

    {

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
            trim: true,
        },

        company: {
            type: String,
            trim: true,
        },

        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            default: null,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        budget: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [

                "unread",

                "read",

                "replied",

                "archived",

            ],
            default: "unread",

        },

        adminReply: {

            type: String,

            default: null,

        },

        repliedAt: {

            type: Date,

            default: null,

        },

        repliedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null,

        },

    },

    {

        timestamps: true,

    }

);

module.exports = mongoose.model("Message", messageSchema);
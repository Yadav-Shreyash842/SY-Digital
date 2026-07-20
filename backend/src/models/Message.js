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
    default: "",
},

        company: {
    type: String,
    trim: true,
    default: "",
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
    min: 0,
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
    trim: true,
    default: "",
},

        clientReplies: [
            {
                text: { type: String, trim: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],

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


messageSchema.index({ status: 1 });
messageSchema.index({ service: 1 });
messageSchema.index({ repliedBy: 1 });
messageSchema.index({ createdAt: -1 });

messageSchema.index({
    status: 1,
    createdAt: -1,
});

messageSchema.index({
    name: "text",
    subject: "text",
    message: "text",
    company: "text",
});

messageSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Message", messageSchema);

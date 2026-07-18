const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
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

        company: {
    type: String,
    trim: true,
    default: "",
},

        

        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        review: {
            type: String,
            required: true,
            trim: true,
        },

     profileImage: {
    publicId: {
        type: String,
        default: "",
    },
    url: {
        type: String,
        default: "",
    },
},

        featured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
            ],
            default: "pending",
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

reviewSchema.index({ status: 1 });
reviewSchema.index({ featured: 1 });
reviewSchema.index({ service: 1 });
reviewSchema.index({ createdBy: 1 });
reviewSchema.index({ createdAt: -1 }); 

reviewSchema.index({
    status: 1,
    featured: 1,
}); 

reviewSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});


module.exports = mongoose.model("Review", reviewSchema);
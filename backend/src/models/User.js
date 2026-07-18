const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

  phone: {
    type: String,
    trim: true,
    default: "",
     }  ,

   avatar: {
    type: String,
    trim: true,
    default: "",
},

    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

   googleId: {
    type: String,
    trim: true,
    default: "",
},
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
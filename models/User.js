const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 4,
      max: 30,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: Number,
      required: true,
      min: 0,
      max: 2,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);

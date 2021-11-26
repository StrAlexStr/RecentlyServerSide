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
      max: 60,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    profilePicture: {
      type: String,
      default: "",
    }, //See later what to do with theese
    coverPicture: {
      type: String,
      default: "",
    }, //See later what to do with theese
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
    }, // min max for the date according to the UI
    gender: {
      type: Number,
      required: true,
      min: 0, //Male,Female,Other(Custom)
      max: 2,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

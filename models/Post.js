const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 250 },
    img: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);

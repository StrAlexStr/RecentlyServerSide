const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
const verifyToken = require("./verifyToken");
dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("CONNECTED");
  }
);

//middleware
// app.use(express.urlencoded());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storagePost = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/images/posts");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const storageAvat = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/images/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

app.use(
  "/assets/images/posts",
  express.static(path.join(__dirname, "/public/assets/images/posts"))
);

app.use(
  "/assets/images/avatars",
  express.static(path.join(__dirname, "/public/assets/images/avatars"))
);
const uploadAvatImg = multer({ storage: storageAvat });
const uploadPostImg = multer({ storage: storagePost });

app.post(
  "/api/upload/post_img",
  verifyToken,
  uploadPostImg.single("file"),
  (req, res) => {
    try {
      return res.status(200).json("Post img has been uploaded corectly");
    } catch (err) {
      console.log(err);
    }
  }
);
app.post("/api/upload/avatar", uploadAvatImg.single("file"), (req, res) => {
  try {
    return res.status(200).json("Avatar img has been uploaded corectly");
  } catch (err) {
    console.log(err);
  }
});

app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/auth", authRoute);

app.listen(8900, () => {
  console.log("Backend server is running on port 8900!");
});

app.get("/", (req, res) => {
  res.send("Welcome to Recently server side!");
});

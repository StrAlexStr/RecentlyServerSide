const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//get a post
router.get("/:id", async (req, res) => {
  try {
    const thePost = await Post.findById(req.params.id);
    res.status(200).json(thePost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//create a post
router.post("/create", async (req, res) => {
  try {
    const baseUser = await User.findById(req.body.userId);
    if (baseUser) {
      const createdPost = await Post(req.body);
      const savedPost = await createdPost.save();
      res.status(200).json(savedPost);
    } else {
      res.status(404).json("Such user does not exist in our database");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//delete a post (only yours)
router.delete("/:id", async (req, res) => {
  try {
    const postToDelete = await Post.findById(req.params.id);
    if (postToDelete.userId == req.body.userId) {
      const deletedPost = await postToDelete.deleteOne();
      res.status(200).json(deletedPost);
    } else {
      res.status(403).json("You can only modify your posts");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//update a post (only yours)
router.put("/:id", async (req, res) => {
  try {
    const postToUpdate = await Post.findById(req.params.id);
    if (postToUpdate.userId == req.body.userId) {
      await postToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Post has been updated successfully");
    } else {
      res.status(403).json("You can only modify your posts");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get all the posts(except yours)
router.get("/get/all_posts/:userId", async (req, res) => {
  try {
    const baseUser = await User.findById(req.params.userId);
    if (baseUser) {
      const posts = await Post.find({
        userId: { $nin: `${req.params.userId}` },
      });
      res.status(200).json(posts);
    } else {
      res.status(404).json("Such user does not exist in our database");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all following posts
router.get("/get/following/:userId", async (req, res) => {
  try {
    const baseUser = await User.findById(req.params.userId);
    if (baseUser) {
      const posts = await Post.find({
        userId: { $in: baseUser.following },
      });
      res.status(200).json(posts);
    } else {
      res.status(404).json("Such user does not exist in our database");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get all posts for a certain user
router.get("/all_posts/", async (req, res) => {
  const username = req.query.username;
  try {
    const user = username
      ? await User.findOne({ username: username })
      : await User.findById(req.query.userId);
    if (user) {
      const posts = await Post.find({ userId: { $eq: req.params.userId } });
      res.status(200).json(posts);
    } else {
      res.status(404).json("Such user does not exist in our database");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

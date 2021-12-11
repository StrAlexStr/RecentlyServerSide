const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const verifyToken = require("../verifyToken");
//get a user
router.get("/", verifyToken, async (req, res) => {
  const username = req.query.username;
  try {
    const user = username
      ? await User.findOne({ username: username })
      : await User.findById(req.query.userId);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//delete user
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can modify only your account");
  }
});

//update user (maybe we will use it later)
router.put("/:id", verifyToken, async (req, res) => {
  if (req.body.userId == req.params.id) {
    if (req.body.password) {
      try {
        const newSalt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, newSalt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been modified successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can modify only your account");
  }
});

// all users (except the current one)
router.get("/get/all_users/:userId", verifyToken, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $nin: `${req.params.userId}` },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get following (implement if needed)

//follow a user
router.put("/follow/:id", verifyToken, async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const toFollowUser = await User.findById(req.params.id);
      const baseUser = await User.findById(req.body.userId);
      if (!baseUser.following.includes(req.params.id)) {
        await baseUser.updateOne({ $push: { following: req.params.id } });
        await toFollowUser.updateOne({
          $push: { followers: req.body.userId },
        });
        res
          .status(200)
          .json(
            `user ${req.params.id} has been followed by ${req.body.userId}`
          );
      } else {
        res.status(403).json("User is already followed");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can not follow yourself");
  }
});

//unfollow a user

router.put("/unfollow/:id", verifyToken, async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const toUnfollowUser = await User.findById(req.params.id);
      const baseUser = await User.findById(req.body.userId);
      if (baseUser.following.includes(req.params.id)) {
        await baseUser.updateOne({ $pull: { following: req.params.id } });
        await toUnfollowUser.updateOne({
          $pull: { followers: req.body.userId },
        });
        res
          .status(200)
          .json(
            `user ${req.params.id} has been unfollowed by ${req.body.userId}`
          );
      } else {
        res.status(403).json("User is unfollowed already");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("You can't unfollow yourself");
  }
});

module.exports = router;

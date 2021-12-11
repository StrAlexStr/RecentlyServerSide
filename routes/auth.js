const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const verifyToken = require("../verifyToken");

// router.get("/isUserAuth", verifyToken, (req, res) => {
//   res.json("You are signed in");
// });

//register
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const userEmail = await User.findOne({ email: req.body.email });
  const userUsername = await User.findOne({ username: req.body.username });
  if (userEmail || userUsername) {
    return res.status(403).json("The username or email has already been taken");
  }

  const createdUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass,
    dob: req.body.dob,
    gender: req.body.gender,
    profilePicture: req.body.profilePicture,
  });
  try {
    const user = await createdUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user &&
      res.status(404).json({ auth: false, message: "User is not in the DB" });
    const validPass = await bcrypt.compare(req.body.password, user.password);
    !validPass &&
      res.status(400).json({ auth: false, message: "INCORRECT PASSWORD" });

    const id = user.id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET);
    // console.log(token);
    res.status(200).json({ result: user, auth: true, token: token });
    // res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ auth: false, message: "no such user exists" });
    // res.status(500).json(err);
  }
});

module.exports = router;

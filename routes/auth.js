const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//register
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const createdUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass,
    dob: req.body.dob,
    gender: req.body.gender,
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
    !user && res.status(404).json("User is not in the DB");
    const validPass = await bcrypt.compare(req.body.password, user.password);
    !validPass && res.status(400).json("INCORRECT PASSWORD");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

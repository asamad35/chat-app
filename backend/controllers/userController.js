const asyncHandler = require("express-async-handler");
const utils = require("../utils");
const User = require("../models/userModel");

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;

  if (!email || !name || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    new Error("User nalready exist");
  }

  const user = await User.create({ name, email, password, pic });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: utils.generateToken(user._id),
      user,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not registered");
  }

  if (!(await utils.isPasswordValid(password, user.password))) {
    throw new Error("Password doesn't match");
  }

  res.status(400).json({ user });
});

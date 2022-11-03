const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;

  console.log(!email || !name || !password, name, email, password, req.body);
  if (!email || !name || !password) {
    res.status(400);
    throw new Error("Please enter all the fieldsssss");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    new Error("User already exist");
  }

  const user = await User.create({ name, email, password, pic });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: user.generateToken(),
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
  console.log(password, "password", await user.isPasswordValid(password));

  if (!user) {
    throw new Error("User not registered");
  }

  if (!(await user.isPasswordValid(password))) {
    throw new Error("Password doesn't match");
  }

  res.status(200).json({ user });
});

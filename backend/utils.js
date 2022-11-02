const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.encryptPassword = async (passwordText) => {
  return await bcrypt.hash(passwordText, 5);
};

exports.isPasswordValid = async (enteredPassword, originalPassword) => {
  return await bcrypt.compare(enteredPassword, originalPassword);
};

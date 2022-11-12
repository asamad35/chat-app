const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userController");
const { isLoggedIn } = require("../middleware/loginmiddleware");

router.route("/").post(registerUser).get(isLoggedIn, allUsers);
router.route("/login").post(loginUser);

module.exports = router;

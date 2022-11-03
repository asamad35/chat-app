const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userController");
const { isLoggedIn } = require("../middleware/loginMiddleware");

router.route("/").post(registerUser).get(isLoggedIn, allUsers);
router.route("/login").post(loginUser);

module.exports = router;

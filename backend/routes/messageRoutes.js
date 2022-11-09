const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
const { isLoggedIn } = require("../middleware/loginMiddleware");
const router = express.Router();

router.route("/").post(isLoggedIn, sendMessage);
router.route("/:chatID").get(isLoggedIn, allMessages);

module.exports = router;

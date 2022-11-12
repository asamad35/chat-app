const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addtogroup,
  removefromgroup,
} = require("../controllers/chatController");
const { isLoggedIn } = require("../middleware/loginmiddleware");
const router = express.Router();

router.route("/").post(isLoggedIn, accessChat);
router.route("/").get(isLoggedIn, fetchChats);
router.route("/creategroup").post(isLoggedIn, createGroupChat);
router.route("/renamegroup").put(isLoggedIn, renameGroup);
router.route("/addtogroup").put(isLoggedIn, addtogroup);
router.route("/removefromgroup").put(isLoggedIn, removefromgroup);

module.exports = router;

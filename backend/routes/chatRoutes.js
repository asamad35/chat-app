const express = require("express");
const { accessChat } = require("../controllers/chatController");
const { isLoggedIn } = require("../middleware/loginMiddleware");
const router = express.Router();

router.route("/").post(isLoggedIn, accessChat);
// router.route("/").get(isLoggedIn, fetchChats);
// router.route("/renamegroup").get(isLoggedIn, renameGroup);
// router.route("/creategroup").get(isLoggedIn, createGroup);
// router.route("/removefromgroup").get(isLoggedIn, removefromgroup);
// router.route("/addtogroup").get(isLoggedIn, addtogroup);

module.exports = router;

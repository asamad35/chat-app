const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  //   isChat = await User.populate(isChat, {
  //     path: "latestMessage.sender",
  //     select: "name pic email",
  //   });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "Your Chat Name",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

exports.fetchChats = asyncHandler(async (req, res) => {
  const allChats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  res.status(200).json(allChats);
});

exports.createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send("please send users and chatName");
  }
  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user);

  const groupChat = await Chat.create({
    chatName: req.body.chatName,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(fullGroupChat);
});

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatID, chatName } = req.body;

  let targetChat = await Chat.findById(chatID);
  if (targetChat.isGroupChat === false) {
    res.status(400);
    throw new Error("This is not a group chat");
  }
  if (targetChat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Only admin can update the group name");
  }

  targetChat = await Chat.findByIdAndUpdate(
    chatID,
    { chatName: chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(targetChat);
});

exports.addtogroup = asyncHandler(async (req, res) => {
  const { chatID, userID } = req.body;

  let targetChat = await Chat.findById(chatID);

  if (targetChat.isGroupChat === false) {
    res.status(400);
    throw new Error("This is not a group chat");
  }
  if (targetChat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Only admin can add members");
  }

  targetChat = await Chat.findByIdAndUpdate(
    chatID,
    { $push: { users: userID } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(targetChat);
});

exports.removefromgroup = asyncHandler(async (req, res) => {
  const { chatID, userID } = req.body;

  let targetChat = await Chat.findById(chatID);

  if (targetChat.isGroupChat === false) {
    res.status(400);
    throw new Error("This is not a group chat");
  }
  if (targetChat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Only admin can add members");
  }

  targetChat = await Chat.findByIdAndUpdate(
    chatID,
    { $pull: { users: userID } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(targetChat);
});

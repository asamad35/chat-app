const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

exports.sendMessage = asyncHandler(async (req, res) => {
  const { content, chatID } = req.body;

  if (!content || !chatID) {
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatID,
  };

  try {
    let message = await Message.create(newMessage);

    await message.populate("sender", "name pic");
    await message.populate("chat");
    // message = await User.populate(message, {
    //   path: "chat.users",
    //   select: "name pic email",
    // });

    await Chat.findByIdAndUpdate(req.body.chatID, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

exports.allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatID })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

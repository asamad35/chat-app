require("dotenv").config();
const express = require("express");
const chats = require("./data/data");
const connectDB = require("./config/db");
require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleWare");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
connectDB();

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(
  process.env.port || 5000,
  console.log(`server is running at port ${process.env.port || 5000}`.yellow)
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3001",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room" + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    console.log(newMessageReceived, "newMessageReceivednewMessageReceived");
    if (!chat.users) {
      console.log("users not defined");
      return;
    }

    chat.users.forEach((user) => {
      console.log(
        user,
        newMessageReceived.sender._id,
        user !== newMessageReceived.sender._id,
        "useruseruseruser"
      );
      if (user !== newMessageReceived.sender._id) {
        socket.in(user).emit("message received", newMessageReceived);
      }
    });
  });

  socket.off("setup", (userData) => {
    console.log("Disconnected");
    socket.leave(userData._id);
  });
});

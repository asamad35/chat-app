require("dotenv").config();
const express = require("express");
require("colors");

const connectDB = require("./config/db");
const chats = require("./data/data");

const app = express();
connectDB();
app.get("/api/chats", (req, res) => res.send(chats));
app.get("/api/chats/:id", (req, res) => {
  const singleChat = chats.find((el) => el?._id === req.params.id);
  res.send(singleChat);
});

app.listen(
  process.env.port || 5000,
  console.log(`server is running at port ${process.env.port || 5000}`.yellow)
);

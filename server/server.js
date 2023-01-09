import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// db
mongoose
  .connect(process.env.DATABASE)
  /* REMOVED
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
  */
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log("DB CONNECTION ERROR > ", err));

// middlewares
app.use(
  express.json({
    limit: "22mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

// automatically load routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// socketio
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

const port = process.env.PORT || 8000;

http.listen(port, () => console.log(`Server running on port ${port}`));

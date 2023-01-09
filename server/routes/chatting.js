import express from "express";

const router = express.Router();

import { requireSignin } from "../middlewares";

import {
  openChat,
  renderChats,
  createGroupChat,
  renameGroupChat,
  removeFromGroupChat,
  addToGroupChat,
  sendMessageToChat,
  checkAllMessages,
} from "../controllers/chatting";

// Chat
router.post("/chat", requireSignin, openChat);
router.get("/chat", requireSignin, renderChats);
router.post("/chat-group", requireSignin, createGroupChat);
router.put("/chat-rename", requireSignin, renameGroupChat);
router.put("/chat-groupremove", requireSignin, removeFromGroupChat);
router.put("/chat-groupadd", requireSignin, addToGroupChat);

// Message
router.post("/text-message", requireSignin, sendMessageToChat);
router.get("/text-message/:chatId", requireSignin, checkAllMessages);

module.exports = router;

import Chat from "../models/chat";
import User from "../models/user";
import Message from "../models/message";

// /api/chat
export const openChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({
        error: "UserId is param is not send with req",
      });
    }

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name username",
    });

    if (isChat.length > 0) {
      res.json(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await Chat.create(chatData);

        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.json(FullChat);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// /api/chat
export const renderChats = async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name username",
        });
        res.json(results);
      });
    // res.json(result);
  } catch (err) {
    console.log(err);
  }
};

// /api/chat-group
export const createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.json({
        error: "Fill in all the fields",
      });
    }

    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res.json({
        error: "More than 2 users are required to create a group chat!",
      });
    }

    users.push(req.user);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.json(fullGroupChat);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

// /api/chat-rename
export const renameGroupChat = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      return res.json({
        error: "Chat not found!",
      });
    } else {
      res.json(updatedChat);
    }
  } catch (err) {
    console.log(err);
  }
};

// /api/chat-groupremove
export const removeFromGroupChat = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.json({
        error: "Chat not found!",
      });
    } else {
      res.json(removed);
    }
  } catch (err) {
    console.log(err);
  }
};

// /api/chat-groupadd
export const addToGroupChat = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.json({
        error: "Chat not found!",
      });
    } else {
      res.json(added);
    }
  } catch (err) {
    console.log(err);
  }
};

// /api/text-message
export const sendMessageToChat = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.json({
        error: "Invalid data passed into request",
      });
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    try {
      var message = await Message.create(newMessage);

      message = await message.populate("sender", "name");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name username",
      });
      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });
      res.json(message);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

// /api/text-message/${chatId}
export const checkAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    })
      .populate("sender", "name username")
      .populate("chat");

    res.json(messages);
  } catch (err) {
    console.log(err);
  }
};

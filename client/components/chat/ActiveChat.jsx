// React hooks
import { useContext, useEffect, useState } from "react";

// Axios
import axios from "axios";

// Custom Components
import { UserContext } from "../../context";
import UpdateChatGroupPopup from "./UpdateChatGroupPopup";
import { getSenderUser } from "../../config/ChatFunctions";
import ChatLoading from "./ChatLoading";
import ChatScrolling from "./ChatScrolling";

// Ant Design UI library
import { Input } from "antd";

// Toast Notification
import { toast } from "react-toastify";

// Socket.io
import io from "socket.io-client";

const LP = process.env.NEXT_PUBLIC_SOCKETIO;
var soc, chatSelectedToCompare;

const ActiveChat = ({ renderChat, setRenderChat }) => {
  // User authentication state
  const [state, setState, selectedChat, setSelectedChat, chats, setChats] =
    useContext(UserContext);

  // Array messages;
  const [messages, setMessages] = useState([]);
  // boolean loading;
  const [loading, setLoading] = useState(false);
  // string newMessage;
  const [newMessage, setNewMessage] = useState("");

  // socket.io
  const [socCon, setSocCon] = useState(false);

  const renderMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/text-message/${selectedChat._id}`);
      setMessages(data);
      setLoading(false);
      soc.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to display messages");
    }
  };

  const sendMessageToChat = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const { data } = await axios.post("/text-message", {
          content: newMessage,
          chatId: selectedChat, //removed ._id
        });

        soc.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Couldn't send a message");
      }
    }
  };

  const typingUser = (event) => {
    setNewMessage(event.target.value);
  };

  // socket
  useEffect(() => {
    if (state && state.token) {
      soc = io(LP);
      soc.emit("setup", state.user);
      soc.on("connected", () => setSocCon(true)); //connection to connected
    }
  }, [state, state.token]);

  // render messages
  useEffect(() => {
    renderMessages();

    chatSelectedToCompare = selectedChat;
  }, [selectedChat]);

  // realtime chatting
  useEffect(() => {
    if (state && state.token) {
      soc.on("message recieved", (newMessageRecieved) => {
        if (
          // if this chat isn't selected on left side and isn't same as the chat on the right
          !chatSelectedToCompare ||
          chatSelectedToCompare._id !== newMessageRecieved.chat._id
        ) {
          // do nothing
        } else {
          setMessages([...messages, newMessageRecieved]);
        }
      });
    }
  }, [state, state.token]);

  return (
    <div>
      {selectedChat ? (
        <div>
          {messages &&
            (!selectedChat.isGroupChat ? (
              <div className="activeChat">
                <div className="activeChat__header">
                  {selectedChat &&
                    state &&
                    selectedChat.users &&
                    getSenderUser(state.user, selectedChat.users)}{" "}
                </div>
                {loading ? (
                  <ChatLoading />
                ) : (
                  <div>
                    <ChatScrolling messages={messages} />
                  </div>
                )}
                <div className="activeChat__footer">
                  <Input
                    placeholder="Enter a message..."
                    onChange={typingUser}
                    value={newMessage}
                    onKeyDown={sendMessageToChat}
                  />
                </div>
              </div>
            ) : (
              <div className="activeChat">
                <div className="activeChat__header">
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateChatGroupPopup
                  className="activeChat__headerPlus"
                    renderChat={renderChat}
                    setRenderChat={setRenderChat}
                    renderMessages={renderMessages}
                  />
                </div>
                {loading ? (
                  <ChatLoading />
                ) : (
                  <div>
                    <ChatScrolling messages={messages} />
                  </div>
                )}
                <div className="activeChat__footer">
                  <Input
                    placeholder="Enter a message..."
                    onChange={typingUser}
                    value={newMessage}
                    onKeyDown={sendMessageToChat}
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div>Select a user to chat</div>
      )}
    </div>
  );
};

export default ActiveChat;

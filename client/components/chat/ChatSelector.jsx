// React hooks
import { useContext, useState, useEffect } from "react";

// Axios
import axios from "axios";

// Custom Components
import { UserContext } from "../../context";
import ChatLoading from "./ChatLoading";
import { getSenderUser } from "../../config/ChatFunctions";
import ChatGroupPopup from "./ChatGroupPopup";

// Toast Notification
import { toast } from "react-toastify";

const ChatSelector = ({ renderChat }) => {
  // User authentication state
  const [state, setState, selectedChat, setSelectedChat, chats, setChats] =
    useContext(UserContext);

  const renderChats = async () => {
    try {
      const { data } = await axios.get("/chat");
      setChats(data);
    } catch (error) {
      toast.error("Couldn't load chats");
    }
  };

  useEffect(() => {
    if (state && state.token) {
      JSON.parse(localStorage.getItem("auth"));
      renderChats();
    }
  }, [state, state.token, renderChat]);

  return (
    <div className="chatSelector">
      <div className="chatSelector__header">
        Chats
        <ChatGroupPopup renderChats={renderChats} />
      </div>
      <div>
        {chats ? (
          // scrollable
          <div className="chatSelector__body">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className="chatSelector__btn"
                key={chat._id}
              >
                <p>
                  {!chat.isGroupChat
                    ? getSenderUser(state.user, chat.users)
                    : chat.chatName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default ChatSelector;

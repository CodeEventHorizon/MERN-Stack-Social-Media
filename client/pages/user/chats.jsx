// React hooks
import { useContext, useState } from "react";

// Custom Components
import { UserContext } from "../../context";
import ChatSelector from "../../components/chat/ChatSelector";
import ChatContainer from "../../components/chat/ChatContainer";

const chats = () => {
  // User authentication state
  const [state] = useContext(UserContext);

  // boolean renderChat;
  const [renderChat, setRenderChat] = useState(false);

  return (
    <div className="chats">
      <div className="chats__body">
        {state && <ChatSelector renderChat={renderChat} />}
        {state && (
          <ChatContainer
            renderChat={renderChat}
            setRenderChat={setRenderChat}
          />
        )}
      </div>
    </div>
  );
};

export default chats;

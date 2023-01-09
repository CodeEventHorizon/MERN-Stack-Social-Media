// Custom Components
import ActiveChat from "./ActiveChat";

const ChatContainer = ({ renderChat, setRenderChat }) => {
  return (
    <div>
      <ActiveChat renderChat={renderChat} setRenderChat={setRenderChat} />
    </div>
  );
};

export default ChatContainer;

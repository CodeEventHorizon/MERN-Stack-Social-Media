// React hooks
import { useContext } from "react";

// Ant Design UI library
import { Avatar, Tooltip } from "antd";

// Custom Components
import {
  isLastSentText,
  isIdenticalSender,
  isIdenticalSenderMargin,
  isIdenticalUser,
} from "../../config/ChatFunctions";
import { UserContext } from "../../context";

const ChatScrolling = ({ messages }) => {
  // User Authentication state
  const [state] = useContext(UserContext);

  return (
    <div className="activeChat__body">
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isIdenticalSender(messages, m, i, state.user._id) ||
              isLastSentText(messages, i, state.user._id)) && (
              <Tooltip title={m.sender.name} placement="bottom">
                <Avatar>{m.sender.name[0]}</Avatar>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === state.user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isIdenticalSenderMargin(
                  messages,
                  m,
                  i,
                  state.user._id
                ),
                marginTop: isIdenticalUser(messages, m, i, state.user._id)
                  ? 3
                  : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default ChatScrolling;

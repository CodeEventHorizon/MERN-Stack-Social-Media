// React hooks
import { useState, useContext } from "react";

// Axios
import axios from "axios";

// Custom Components
import { UserContext } from "../../context";
import UserTag from "../cards/UserTag";
import ChatLoading from "./ChatLoading";
import UserinList from "../cards/UserinList";

// Ant Design UI library
import { PlusCircleOutlined } from "@ant-design/icons";
import { Modal, Button, Input } from "antd";

// Toast Notification
import { toast } from "react-toastify";

const UpdateChatGroupPopup = ({
  renderChat,
  setRenderChat,
  renderMessages,
}) => {
  // User Authentication state
  const [state, setState, selectedChat, setSelectedChat] =
    useContext(UserContext);

  // string groupChatName;
  const [groupChatName, setGroupChatName] = useState();
  // string search;
  const [search, setSearch] = useState("");
  // Array searchResult;
  const [searchResult, setSearchResult] = useState([]);
  // boolean loading;
  const [loading, setLoading] = useState(false);
  // boolean renamingLoading;
  const [renamingLoading, setRenamingLoading] = useState(false);

  // boolean isModalVisible;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const removeUserFromChat = async (u) => {
    if (
      selectedChat.groupAdmin._id !== state.user._id &&
      u._id !== state.user._id
    ) {
      toast.error("Only admins can remove someone");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put("/chat-groupremove", {
        chatId: selectedChat._id,
        userId: u._id,
      });

      u._id === state.user._id ? setSelectedChat() : setSelectedChat(data);
      setRenderChat(!renderChat);
      renderMessages();
      setLoading(false);
    } catch (error) {
      toast.error("Couldn't leave the group chat!");
    }
  };

  const renameGroupChat = async () => {
    if (!groupChatName) return;
    try {
      setRenamingLoading(true);

      const { data } = await axios.put("/chat-rename", {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });

      setSelectedChat(data);
      setRenderChat(!renderChat);
      setRenamingLoading(false);
    } catch (error) {
      toast.error("Couldn't rename the group chat!");
      setRenamingLoading(false);
    }
    setGroupChatName("");
  };

  const getAllUsers = async (q) => {
    setSearch(q);
    if (!q) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/check-all-users?search=${search}`);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results");
      setLoading(false);
    }
  };

  const addUserToGroup = async (user) => {
    if (selectedChat.users.find((u) => u._id === user._id)) {
      toast.error("User already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== state.user._id) {
      toast.error("Only admins can add someone");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put("/chat-groupadd", {
        chatId: selectedChat._id,
        userId: user._id,
      });

      setSelectedChat(data);
      setRenderChat(!renderChat);
      setLoading(false);
    } catch (error) {
      toast.error("Couldn't add to group chat!");
    }
  };

  return (
    <div>
      <Button onClick={showModal}>
        <PlusCircleOutlined />
      </Button>
      <Modal
        title={selectedChat.chatName}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedChat &&
          selectedChat.users.map(
            (user) =>
              user._id !== selectedChat.groupAdmin._id && (
                <UserTag
                  key={user._id}
                  user={user}
                  runFunc={() => removeUserFromChat(user)}
                />
              )
          )}

        <Input
          placeholder="Change Chat Name"
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <Button onClick={renameGroupChat}>Update</Button>

        <Input
          placeholder="Add User to group"
          onChange={(e) => getAllUsers(e.target.value)}
        />
        <Button onClick={() => removeUserFromChat(state.user)}>
          Leave Group
        </Button>
        {loading ? (
          <ChatLoading />
        ) : (
          searchResult?.map((user) => (
            <UserinList
              key={user._id}
              user={user}
              runFunc={() => addUserToGroup(user)}
            />
          ))
        )}
      </Modal>
    </div>
  );
};

export default UpdateChatGroupPopup;

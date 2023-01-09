// React hooks
import { useState, useContext } from "react";

// Axios
import axios from "axios";

// Custom Components
import { UserContext } from "../../context";
import ChatLoading from "./ChatLoading";
import UserinList from "../cards/UserinList";
import UserTag from "../cards/UserTag";

// Ant Design library
import { Modal, Button, Input } from "antd";

// Toast Notification
import { toast } from "react-toastify";

const ChatGroupPopup = ({ renderChats }) => {
  // boolean isModalVisible;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupName, setGroupName] = useState();
  const [selectedPeople, setSelectedPeople] = useState("");
  const [searchField, setSearchField] = useState("");
  const [searchAnswer, setSearchAnswer] = useState([]);
  const [loading, setLoading] = useState(false);

  // chat state, authenticated
  const [state, setState, chats, setChats] = useContext(UserContext);

  const showAllUsers = async (query) => {
    setSearchField(query);
    if (!query) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/check-all-users?search=${searchField}`);
      setLoading(false);
      setSearchAnswer(data);
    } catch (error) {
      toast.error("Couldn't find users");
    }
  };

  const createGroupChat = async () => {
    if (!groupName || !selectedPeople) {
      toast.error("Please fill in all the fields");
      return;
    }
    try {
      const { data } = await axios.post("/chat-group", {
        name: groupName,
        users: JSON.stringify(selectedPeople.map((user) => user._id)),
      });
      setChats([data, chats]); // changed ...chats to chats
      renderChats();
      setIsModalVisible(false);
      toast.success("New Group Chat Created!");
    } catch (error) {
      toast.error("Failed to create a group chat!");
    }
  };

  const deleteUser = (delUser) => {
    setSelectedPeople(selectedPeople.filter((sel) => sel._id !== delUser._id));
  };

  const addUserToGroup = (userToAdd) => {
    if (selectedPeople.includes(userToAdd)) {
      toast.error("User is alreadt in the group!");
      return;
    }
    setSelectedPeople([...selectedPeople, userToAdd]);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    createGroupChat();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="chatGroupPopup">
      <Button onClick={showModal}>New Group</Button>
      <Modal
        title="Create Group Chat"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <Input
            placeholder="Chat name"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Input
            placeholder="Add Users"
            onChange={(e) => showAllUsers(e.target.value)}
          />
        </div>
        {selectedPeople &&
          selectedPeople.map((user) => (
            <UserTag
              key={user._id}
              user={user}
              runFunc={() => deleteUser(user)}
            />
          ))}
        {loading ? (
          <ChatLoading />
        ) : (
          searchAnswer
            ?.slice(0, 4)
            .map((user) => (
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

export default ChatGroupPopup;

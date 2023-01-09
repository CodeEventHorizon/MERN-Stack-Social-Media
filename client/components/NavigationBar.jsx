// Next API Reference
import { useRouter } from "next/router";
import Link from "next/link";

// React hooks
import { useContext, useEffect, useState } from "react";

// Axios
import axios from "axios";

// Custom Components
import { UserContext } from "../context";
import ChatLoading from "./chat/ChatLoading";
import UserinList from "./cards/UserinList";

// Ant Design UI library
import { Button, Drawer, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Toast Notification
import { toast } from "react-toastify";

const NavigationBar = () => {
  // string currentPage;
  const [currentPage, setCurrentPage] = useState("");
  // Drawer
  // boolean visible;
  const [visible, setVisible] = useState(false);
  // Chat
  // string search;
  const [search, setSearch] = useState("");
  // Array searchAnswer;
  const [searchAnswer, setSearchAnswer] = useState([]);
  // boolean loading;
  const [loading, setLoading] = useState(false);
  // boolean loadingChat;
  const [loadingChat, setLoadingChat] = useState();

  // User Authentication state
  const [state, setState, selectedChat, setSelectedChat, chats, setChats] =
    useContext(UserContext);

  // router
  const router = useRouter();
  const showSearch = router.pathname === "/user/chats" ? true : false;

  useEffect(() => {
    process.browser && setCurrentPage(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  // Logout
  const LogOutFromState = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };

  // Drawer Show
  const showDrawer = () => {
    setVisible(true);
  };

  // Drawer Close
  const onCloseDrawer = () => {
    setVisible(false);
  };

  const getAllUsers = async () => {
    if (!search) {
      toast.error("Enter the name of the user!");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/check-all-users?search=${search}`);
      setLoading(false);
      setSearchAnswer(data);
    } catch (error) {
      toast.error("Failed to load search results!");
    }
  };

  const openChat = async (uId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post("/chat", { userId: uId });

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onCloseDrawer();
    } catch (error) {
      toast.error("Access denied!");
    }
  };

  return (
    <div>
      <nav
        className="nav displayFlex justifyContentBetween"
        style={{ backgroundColor: "black" }}
      >
        {showSearch && (
          <div>
            <Space>
              <Button
                danger
                type="link"
                className="displayFlex alignItemsCenter"
                onClick={showDrawer}
              >
                <SearchOutlined style={{ color: "red" }} />
                Search
              </Button>
            </Space>
            <Drawer
              title="Search for users to chat"
              placement="left"
              width={400}
              onClose={onCloseDrawer}
              visible={visible}
            >
              <Space>
                <div className="displayFlex">
                  <Input
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for users"
                  />
                  <Button onClick={getAllUsers}>Search</Button>
                </div>
              </Space>
              <div>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchAnswer?.map((user) => (
                    <UserinList
                      key={user._id}
                      user={user}
                      runFunc={() => openChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && <ChatLoading />}
              </div>
            </Drawer>
          </div>
        )}
        <Link href="/">
          <a
            className={`nav-link textWhite ${currentPage === "/" && "active"}`}
          >
            Home
          </a>
        </Link>

        {state !== null ? (
          <>
            <div className="displayFlex">
              <div className="btn textWhite">
                {state && state.user && state.user.name}
              </div>

              <Link href="/user/postsPage">
                <a
                  className={`nav-link ${
                    currentPage === "/user/postsPage" && "active"
                  }`}
                >
                  Newsfeed
                </a>
              </Link>

              <Link href={"/user/chats"}>
                <a
                  className={`nav-link 
                    ${currentPage === "/user/chats" && "active"}`}
                >
                  Chatting
                </a>
              </Link>

              <Link href="/user/profile/changeForm">
                <a
                  className={`nav-link ${
                    currentPage === "/user/profile/changeForm" && "active"
                  }`}
                >
                  Profile
                </a>
              </Link>

              <a onClick={LogOutFromState} className="nav-link">
                Logout
              </a>
            </div>
          </>
        ) : (
          <>
            <Link href="/login">
              <a
                className={`nav-link textWhite ${
                  currentPage === "/login" && "active"
                }`}
              >
                Login
              </a>
            </Link>

            <Link href="/register">
              <a
                className={`nav-link textWhite ${
                  currentPage === "/register" && "active"
                }`}
              >
                Register
              </a>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default NavigationBar;

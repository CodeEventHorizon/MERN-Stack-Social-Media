// Next API Reference
import { useRouter } from "next/router";

// React hooks
import { useState, createContext, useEffect } from "react";

// Axios
import axios from "axios";

const UserContext = createContext();

const UProvider = ({ children }) => {
  // User Authentication state
  const [state, setState] = useState({
    user: {},
    token: "",
  });

  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  // Check if user is in localStorage and has previously logged in
  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
  }, []);

  const router = useRouter();

  // Axios
  const token = state && state.token ? state.token : "";
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  axios.interceptors.response.use(
    function (config) {
      return config;
    },
    function (error) {
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        setState(null);
        window.localStorage.removeItem("auth");
        router.push("/login");
      }
    }
  );

  return (
    <UserContext.Provider
      value={[state, setState, selectedChat, setSelectedChat, chats, setChats]}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UProvider };

// Next API Reference
import { useRouter } from "next/router";

// React hooks
import { useEffect, useState, useContext } from "react";

// Axios
import axios from "axios";

// Ant Design UI library
import { SyncOutlined } from "@ant-design/icons";

// Custom Components
import { UserContext } from "../../context";

const RouterForUser = ({ children }) => {
  // boolean view;
  const [view, setView] = useState(false);

  // User authentication state
  const [state] = useContext(UserContext);

  // router
  const router = useRouter();

  useEffect(() => {
    if (state && state.token) {
      thisUserState();
    }
  }, [state && state.token]);

  const thisUserState = async () => {
    try {
      const { data } = await axios.get(`/this-user`);
      if (data.ok) setView(true);
    } catch (err) {
      router.push("/login");
    }
  };

  process.browser &&
    state === null &&
    setTimeout(() => {
      thisUserState();
    }, 1000);

  return !view ? (
    <SyncOutlined
      spin
      className="displayFlex justifyContentCenter dis-1 text-primary p-5"
    />
  ) : (
    <> {children}</>
  );
};

export default RouterForUser;

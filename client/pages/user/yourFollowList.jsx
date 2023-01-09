// Next API Reference
import Link from "next/link";

// React Hooks
import { useContext, useEffect, useState } from "react";

// Axios
import axios from "axios";

// Custom Components
import { UserContext } from "../../context";

// Ant Design UI library
import { Avatar, List } from "antd";

// Toast Notification
import { toast } from "react-toastify";

const Following = () => {
  // Array<Object> following;
  const [following, setFollowing] = useState([]);

  // User authentication state
  const [state, setState] = useContext(UserContext);

  // useEffect runs after React has updated the DOM (Document Object Model)
  useEffect(() => {
    // if user is logged in render/fetch followings list
    if (state && state.token) {
      getFollowingList();
    }
    // dependencies -> []
  }, [state && state.token]);

  // get Array<Object> following;
  const getFollowingList = async () => {
    try {
      // get following's array from the database
      const { data } = await axios.get("/following-user");
      setFollowing(data);
    } catch (err) {
      toast.error("Couldn't load following's list");
    }
  };

  // UNFOLLOW
  const unfollowUser = async (user) => {
    try {
      // send user id to unfollow from following's list
      const { data } = await axios.put("/unfollow-user", { _id: user._id });
      // get data from local storage
      let authentication = JSON.parse(localStorage.getItem("auth"));
      authentication.user = data;
      // set data to local storage
      localStorage.setItem("auth", JSON.stringify(authentication));
      // Reset the state of logged in user
      setState({ ...state, user: data });
      // Filter followings list
      let filterFollowing = following.filter((p) => p._id !== user._id);
      setFollowing(filterFollowing);
      // Unfollow notification
      toast.success(`You unfollowed ${user.name}`);
    } catch (err) {
      toast.error(`Failed to unfollow ${user.name}`);
    }
  };

  return (
    <div className="horizontalWrap verticalWrap-md-6 offset-md-3">
      <List
        itemLayout="horizontal"
        dataSource={following}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size={38}>{user.name[0]}</Avatar>}
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {user.name}
                  <span
                    onClick={() => unfollowUser(user)}
                    className="text-primary pointer"
                  >
                    Unfollow
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Link href="/user/postsPage">
        <a style={{ display: "flex", justifyContent: "center" }}>Go back</a>
      </Link>
    </div>
  );
};

export default Following;

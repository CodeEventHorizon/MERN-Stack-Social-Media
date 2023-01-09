// Next API Reference
import { useRouter } from "next/router";
import Link from "next/link";

// React hooks
import { useEffect, useState } from "react";

// Axios
import axios from "axios";

// Ant Design UI library
import { Card } from "antd";

// Date formatting library
import moment from "moment";

// Toast Notification
import { toast } from "react-toastify";

const Username = () => {
  // Object userObject;
  const [userObject, setUserObject] = useState({});

  // router
  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      getUser();
    }
  }, [router.query.username]);

  const getUser = async () => {
    try {
      const { data } = await axios.get(`/user/${router.query.username}`);
      setUserObject(data);
    } catch (err) {
      toast.error("Failed to get the user!");
    }
  };

  return (
    <div className="horizontalWrap verticalWrap-md-6 offset-md-3">
      <div className="pt-5 pb-5">
        <Card hoverable>
          <Card.Meta title={userObject.name} description={"About: " + userObject.about} />
          <p>User joined: {moment(userObject.createdAt).fromNow()}</p>
          <div className="displayFlex justifyContentBetween">
            <span className="btn btn-sm">
              {userObject.followers && userObject.followers.length} Followers
            </span>
            <span className="btn btn-sm">
              {userObject.following && userObject.following.length} Following
            </span>
          </div>
        </Card>

        <Link href="/user/postsPage">
          <a className="displayFlex justifyContentCenter">Go back</a>
        </Link>
      </div>
    </div>
  );
};

export default Username;

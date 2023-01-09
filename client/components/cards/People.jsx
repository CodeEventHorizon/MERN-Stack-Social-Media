// Next API Reference
import Link from "next/link";

// React hooks
import { useContext } from "react";

// Custom Components
import { UserContext } from "../../context";

// Ant Design UI library
import { Avatar, List } from "antd";

const People = ({ users, followUser, unfollowUser }) => {
  // User authentication state
  const [state] = useContext(UserContext);

  return (
    <div className="card-horizontal-spacing">
      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(u) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size={40}>{u.name[0]}</Avatar>}
              title={
                <div className="displayFlex justifyContentBetween">
                  <Link href={`/user/${u.username}`}>
                    <a>{u.name}</a>
                  </Link>
                  {state &&
                  state.user &&
                  u.followers &&
                  u.followers.includes(state.user._id) ? (
                    <span
                      onClick={() => unfollowUser(u)}
                      className="text-primary pointer"
                    >
                      Unfollow
                    </span>
                  ) : (
                    <span
                      onClick={() => followUser(u)}
                      className="text-primary pointer"
                    >
                      Follow
                    </span>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default People;

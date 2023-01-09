// Ant Design UI library
import { Space, Avatar } from "antd";

const UserinList = ({ user, runFunc }) => {
  return (
    <div>
      <Space onClick={runFunc} className="pointer userinList">
        <Avatar>{user.name[0]}</Avatar>
        <Space>
          <b>{user.name}</b>
          {user.username}
        </Space>
      </Space>
    </div>
  );
};

export default UserinList;

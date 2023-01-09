// Ant Design UI library
import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";

const UserTag = ({ user, runFunc }) => {
  return (
    <>
      <Button onClick={runFunc}>
        <CloseOutlined /> {user.name}{" "}
      </Button>
    </>
  );
};

export default UserTag;

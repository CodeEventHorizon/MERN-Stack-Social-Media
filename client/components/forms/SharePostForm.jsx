// Ant Design UI library
import { Avatar } from "antd";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";

const SharePostForm = ({
  text,
  setText,
  createPost,
  uploadImage,
  uploadLoading,
  picture,
}) => {
  return (
    <div className="card card-horizontal-spacing">
      <form className="form-group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="formControl"
          placeholder="What's on your mind?"
        ></textarea>
      </form>

      <div className="cardFooter displayFlex justifyContentBetween text-muted">
        <button
          disabled={!text}
          onClick={createPost}
          className="btn btn-primary"
        >
          Share
        </button>
        <label>
          {picture && picture.url ? (
            <Avatar size={30} src={picture.url} className="mt-1" />
          ) : uploadLoading ? (
            <LoadingOutlined className="mt-1 pointer" />
          ) : (
            <CameraOutlined className="mt-1 pointer" />
          )}
          <input onChange={uploadImage} type="file" accept="images/*" hidden />
        </label>
      </div>
    </div>
  );
};

export default SharePostForm;

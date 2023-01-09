// Next API Reference
import { useRouter } from "next/router";
import Link from "next/link";

// React hooks
import { useContext } from "react";

// Custom Components
import SharePicture from "../images/SharePicture";
import { UserContext } from "../../context";

// Ant design UI library
import { Avatar } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

// Date formatting
import moment from "moment";

const Post = ({
  post,
  deletePost,
  likePost,
  unlikePost,
  viewPostComment,
  NcommentsToShow = 2,
  removeCommentFromPost,
}) => {
  // User authentication state
  const [state] = useContext(UserContext);

  // router
  const router = useRouter();

  return (
    <>
      {post && post.postedBy && (
        <div
          className="card card-vertical-spacing card-horizontal-spacing"
          key={post._id}
        >
          <div className="cardHeader">
            <Avatar size={40} className="mb-2">
              {post.postedBy.name[0]}
            </Avatar>
            <span style={{ marginLeft: "1rem" }}>{post.postedBy.name}</span>
            <span style={{ marginLeft: "1rem" }}>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <div className="cardBody">{post.content}</div>
          <div className="cardFooter">
            {post.image && <SharePicture url={post.image.url} />}
            <div className="displayFlex">
              {state &&
              state.user &&
              post.likes &&
              post.likes.includes(state.user._id) ? (
                <HeartFilled
                  onClick={() => unlikePost(post._id)}
                  className="text-danger pt-2 h5"
                />
              ) : (
                <HeartOutlined
                  onClick={() => likePost(post._id)}
                  className="text-danger pt-2 h5"
                />
              )}

              <div className="pt-2" style={{ marginLeft: "1rem" }}>
                {post.likes.length} Likes
              </div>
              <CommentOutlined
                onClick={() => viewPostComment(post)}
                className="text-danger pt-2 h5"
                style={{ marginLeft: "1rem" }}
              />
              <div className="pt-2" style={{ marginLeft: "1rem" }}>
                <Link href={`/post/${post._id}`}>
                  <a>{post.comments.length} Comments</a>
                </Link>
              </div>

              {state && state.user && state.user._id === post.postedBy._id && (
                <>
                  <EditOutlined
                    onClick={() => router.push(`/user/post/${post._id}`)}
                    className="text-danger pt-2 h5 px-2"
                  />
                  <DeleteOutlined
                    onClick={() => deletePost(post)}
                    className="text-danger pt-2 h5 px-2"
                  />
                </>
              )}
            </div>
          </div>
          
          {post.comments && post.comments.length > 0 && (
            <ol className="listGroup">
              {post.comments.slice(0, NcommentsToShow).map((c) => (
                <li
                  key={c._id}
                  className="listGroup-item displayFlex justifyContentBetween alignItemsStart"
                >
                  <div className="ms-2 me-auto">
                    <div>
                      <Avatar size={20} className="mb-2">
                        {c.postedBy.name[0]}
                      </Avatar>
                      {c.postedBy.name}
                    </div>
                    <div>{c.text}</div>
                  </div>
                  <span className="badge rounded-pill text-muted">
                    {moment(c.created).fromNow()}
                    {state && state.user && state.user._id === c.postedBy._id && (
                      <div className="mt-2">
                        <DeleteOutlined
                          style={{fontSize:"170%"}}
                          onClick={() => removeCommentFromPost(post._id, c)}
                          className="text-danger"
                        />
                      </div>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
};

export default Post;

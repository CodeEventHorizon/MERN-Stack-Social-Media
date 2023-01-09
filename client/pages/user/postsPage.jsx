// Next API Reference
import Link from "next/link";

// React Hooks
import { useContext, useState, useEffect } from "react";

// Axios
import axios from "axios";

// Custom Components
import { UserContext } from "../../context";
import RouterForUser from "../../components/routes/RouterForUser";
import SharePostForm from "../../components/forms/SharePostForm";
import PostCatalogue from "../../components/cards/PostCatalogue";
import People from "../../components/cards/People";
import CommentingForm from "../../components/forms/CommentingForm";
import Search from "../../components/Search";

// Ant Design UI library
import { Modal } from "antd";

// Toast Notification
import { toast } from "react-toastify";

const Dashboard = () => {
  // User authentication state
  const [state, setState] = useContext(UserContext);

  // string text;
  const [text, setText] = useState("");
  // Object picture;
  const [picture, setPicture] = useState({});
  // boolean uploadLoading;
  const [uploadLoading, setUploadLoading] = useState(false);
  // Array<Object> posts;
  const [posts, setPosts] = useState([]);
  // Array<Object> users;
  const [users, setUsers] = useState([]);
  // string comment;
  const [comment, setComment] = useState("");
  // boolean view;
  const [view, setView] = useState(false);
  // Object thisPost;
  const [thisPost, setThisPost] = useState({});

  const getNewsfeed = async () => {
    try {
      const { data } = await axios.get("/news-feed");
      setPosts(data);
    } catch (err) {
      toast.error("Failed to load Newsfeed!");
    }
  };

  const findUsers = async () => {
    try {
      const { data } = await axios.get("/find-users");
      setUsers(data);
    } catch (err) {
      toast.error("Failed to find Users!");
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/share-post", {
        content: text,
        image: picture,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        getNewsfeed();
        toast.success("Post has been shared");
        setText("");
        setPicture({});
      }
    } catch (err) {
      toast.error("Failed to create a post!");
    }
  };

  const uploadPicture = async (e) => {
    // first uploaded picture
    const file = e.target.files[0];
    let formField = new FormData();
    formField.append("image", file);
    setUploadLoading(true);
    try {
      const { data } = await axios.post("/upload-picture", formField);
      setPicture({
        url: data.url,
        public_id: data.public_id,
      });
      setUploadLoading(false);
    } catch (err) {
      toast.error("Failed to upload a picture!");
      setUploadLoading(false);
    }
  };

  const deletePost = async (post) => {
    try {
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.success("Succesfully deleted the post!");
      getNewsfeed();
    } catch (err) {
      toast.error("Failed to delete the post!");
    }
  };

  const followUser = async (user) => {
    try {
      const { data } = await axios.put("/follow-user", { _id: user._id });
      // reset localStorage, remember the token
      let authentication = JSON.parse(localStorage.getItem("auth"));
      authentication.user = data;
      localStorage.setItem("auth", JSON.stringify(authentication));
      // reset user state
      setState({ ...state, user: data });
      let userFilter = users.filter((p) => p._id !== user._id);
      setUsers(userFilter);
      getNewsfeed();
      toast.success(`You have followed ${user.name}`);
    } catch (err) {
      toast.error("Failed to follow the user!");
    }
  };

  const likePost = async (_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id });
      getNewsfeed();
    } catch (err) {
      toast.error("Failed to like the post!");
    }
  };

  const unlikePost = async (_id) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      getNewsfeed();
    } catch (err) {
      toast.error("Failed to unlike the post!");
    }
  };

  const viewPostComment = (post) => {
    setThisPost(post);
    setView(true);
  };

  const commentOnPost = async (e) => {
    // e.preventDefault prevents page from refreshing, which gives the feeling of real-time rendering
    e.preventDefault();
    try {
      const { data } = await axios.put("/add-comment", {
        postId: thisPost._id,
        comment,
      });
      setComment("");
      setView(false);
      getNewsfeed();
    } catch (err) {
      toast.error("Failed to comment on post!");
    }
  };

  const removeCommentFromPost = async (postId, comment) => {
    try {
      const { data } = await axios.put("/remove-comment", {
        postId,
        comment,
      });
      getNewsfeed();
    } catch (err) {
      toast.error("Failed to remove comment from post!");
    }
  };

  useEffect(() => {
    if (state && state.token) {
      getNewsfeed();
      findUsers();
    }
  }, [state && state.token]);

  return (
    <RouterForUser>
      <h1>Newsfeed</h1>
      <div className="horizontalWrap">
        <div className="verticalWrap-md-8">
          <SharePostForm
            text={text}
            setText={setText}
            picture={picture}
            uploadImage={uploadPicture}
            createPost={createPost}
            uploadLoading={uploadLoading}
          />
          <PostCatalogue
            posts={posts}
            deletePost={deletePost}
            likePost={likePost}
            unlikePost={unlikePost}
            viewPostComment={viewPostComment}
            removeCommentFromPost={removeCommentFromPost}
          />
        </div>
        <div className="verticalWrap-md-4">
          <Search />
          <br />
          {state && state.user && state.user.following && (
            <Link href={`/user/yourFollowList`}>
              <a className="h6">{state.user.following.length} Following</a>
            </Link>
          )}
          <People users={users} followUser={followUser} />
        </div>
        <Modal
          title="Comment"
          visible={view}
          onCancel={() => setView(false)}
          footer={null}
        >
          <CommentingForm
            comment={comment}
            setComment={setComment}
            commentOnPost={commentOnPost}
          />
        </Modal>
      </div>
    </RouterForUser>
  );
};

export default Dashboard;

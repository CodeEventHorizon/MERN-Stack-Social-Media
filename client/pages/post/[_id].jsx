// Next API Reference
import { useRouter } from "next/router";
import Link from "next/link";

// React hooks
import { useState, useEffect } from "react";

// Axios
import axios from "axios";

// Custom Components
import Post from "../../components/cards/Post";
import CommentingForm from "../../components/forms/CommentingForm";

// Toast Notification
import { toast } from "react-toastify";

// Ant Design UI library
import { Modal } from "antd";

const PostComments = () => {
  // Object post;
  const [post, setPost] = useState({});
  // string comment;
  const [comment, setComment] = useState("");
  // boolean view;
  const [view, setView] = useState(false);
  // Object thisPost;
  const [thisPost, setThisPost] = useState({});

  // router
  const router = useRouter();
  const queryId = router.query._id;

  useEffect(() => {
    if (queryId) getPostById();
  }, [queryId]);

  const getPostById = async () => {
    try {
      const { data } = await axios.get(`/user-post/${queryId}`);
      setPost(data);
    } catch (err) {
      toast.error("Failed to get the post by id!");
    }
  };

  const removeCommentFromPost = async (postId, comment) => {
    try {
      const { data } = await axios.put("/remove-comment", {
        postId,
        comment,
      });
      getPostById();
    } catch (err) {
      toast.error("Failed to remove comment!");
    }
  };

  const likePost = async (_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id });
      getPostById();
    } catch (err) {
      toast.error("Failed to like the post!");
    }
  };

  const unlikePost = async (_id) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      getPostById();
    } catch (err) {
      toast.error("Failed to unlike the post!");
    }
  };

  const deletePost = async (post) => {
    try {
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.success("You have deleted the post");
      router.push("/user/postsPage");
    } catch (err) {
      toast.error("Failed to delete the post!");
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
      getPostById();
    } catch (err) {
      toast.error("Failed to comment on the post!");
    }
  };

  return (
    <div>
      <Post
        post={post}
        NcommentsToShow={10000000}
        deletePost={deletePost}
        removeCommentFromPost={removeCommentFromPost}
        likePost={likePost}
        unlikePost={unlikePost}
        viewPostComment={viewPostComment}
      />
      <Link href="/user/postsPage">
        <a className="displayFlex justifyContentCenter">Go back</a>
      </Link>
      <Modal
        visible={view}
        onCancel={() => setView(false)}
        title="Comment"
        footer={null}
      >
        <CommentingForm
          comment={comment}
          setComment={setComment}
          commentOnPost={commentOnPost}
        />
      </Modal>
    </div>
  );
};

export default PostComments;

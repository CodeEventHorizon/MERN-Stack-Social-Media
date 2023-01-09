// Custom Components
import Post from "./Post";

const PostCatalogue = ({
  posts,
  deletePost,
  likePost,
  unlikePost,
  viewPostComment,
  removeCommentFromPost,
}) => {
  return (
    <div>
      {posts &&
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            deletePost={deletePost}
            likePost={likePost}
            unlikePost={unlikePost}
            viewPostComment={viewPostComment}
            removeCommentFromPost={removeCommentFromPost}
          />
        ))}
    </div>
  );
};

export default PostCatalogue;

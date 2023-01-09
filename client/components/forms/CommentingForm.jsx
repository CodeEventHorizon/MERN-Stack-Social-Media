const CommentingForm = ({commentOnPost, comment, setComment}) => {
  return (
    <form onSubmit={commentOnPost}>
      <input
        type="text"
        className="formControl"
        placeholder="Write something..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className="btn btn-primary mt-3">Submit</button>
    </form>
  );
};

export default CommentingForm;

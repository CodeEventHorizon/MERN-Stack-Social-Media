// NEXT API Reference
import { useRouter } from "next/router";

// React hooks
import { useEffect, useState } from "react";

// Axios
import axios from "axios";

// Custom Components
import SharePostForm from "../../../components/forms/SharePostForm";
import RouterForUser from "../../../components/routes/RouterForUser";

// Toast Notification
import { toast } from "react-toastify";

const EditPost = () => {
  // Object post;
  const [post, setPost] = useState({});
  // string text;
  const [text, setText] = useState("");
  // Object picture;
  const [picture, setImage] = useState({});
  // boolean uploadLoading;
  const [uploadLoading, setUploading] = useState(false);

  // router
  const router = useRouter();
  const queryId = router.query._id;

  useEffect(() => {
    if (queryId) renderPost();
  }, [queryId]);

  const renderPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${queryId}`);
      setPost(data);
      setText(data.content);
      setImage(data.image);
    } catch (err) {
      toast.error("Failed to render post!")
    }
  };

  const createPost = async (e) => {
    // e.preventDefault prevents page from refreshing, which gives the feeling of real-time rendering
    e.preventDefault();
    try {
      const { data } = await axios.put(`/update-post/${queryId}`, {
        content: text,
        image: picture,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Post Edited");
        router.push("/user/postsPage");
      }
    } catch (err) {
      toast.error("Failed to update post!");
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    let formField = new FormData();
    formField.append("image", file);
    setUploading(true);
    try {
      const { data } = await axios.post("/upload-picture", formField);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
    } catch (err) {
      toast.error("Failed to upload Image!");
      setUploading(false);
    }
  };

  return (
    <RouterForUser>
      <h1>Newsfeed</h1>
      <div className="horizontalWrap py-3">
        <div className="verticalWrap-md-8">
          <SharePostForm
            text={text}
            setText={setText}
            createPost={createPost}
            uploadImage={uploadImage}
            uploadLoading={uploadLoading}
            picture={picture}
          />
        </div>
      </div>
    </RouterForUser>
  );
};

export default EditPost;

import Post from "../models/post";
import User from "../models/user";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// /api/share-post
export const sharePost = async (req, res) => {
  const { content, image } = req.body;
  if (!content.length) {
    return res.json({
      error: "Content is required",
    });
  }
  try {
    const post = new Post({
      content,
      image,
      postedBy: req.user._id,
    });
    await post.save(); // await
    const postWithUser = await Post.findById(post._id).populate(
      "postedBy",
      "-password -secret"
    ); //
    res.json(postWithUser); //
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// /api/upload-picture
export const uploadPicture = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    console.log("uploaded image: ", result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(err);
  }
};

// /api/user-posts
export const allPosts = async (req, res) => {
  try {
    //const posts = await Post.find({ postedBy: req.user._id })
    const posts = await Post.find() //{ postedBy: req.user._id } *removed from find()*
      .populate("postedBy", "_id name image")
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

// /api/user-posts/${_id}
export const oneUserPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id)
      .populate("postedBy", "_id name image")
      .populate("comments.postedBy", "_id name image");
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// /api/update-post/${_id}
export const changePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// /api/delete-post/${_id}
export const deleteThePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params._id);
    if (post.image && post.image.public_id) {
      const image = await cloudinary.uploader.destroy(post.image.public_id);
    }
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

// /api/news-feed
export const renderNewsFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let following = user.following;
    following.push(req.user._id);
    // pagination
    // const currentPage = req.params.page || 1;
    // const perPage = 3;

    const posts = await Post.find({ postedBy: { $in: following } })
      // .skip((currentPage - 1) * perPage)
      .populate("postedBy", "_id name image")
      .populate("comments.postedBy", "_id name image")
      .sort({ createdAt: -1 });
    // .limit(perPage);

    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

// /api/like-post
export const likeThePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// /api/unlike-post
export const unlikeThePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// /api/add-comment
export const commentOnPost = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { text: comment, postedBy: req.user._id } },
      },
      { new: true }
    )
      .populate("postedBy", "_id name image")
      .populate("comments.postedBy", "id name image");
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// /api/remove-comment
export const removeTheComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: { _id: comment._id } },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

import expressJwt from "express-jwt";
import Post from "../models/post";

export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const postChangable = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params._id);
    if (req.user._id != post.postedBy) {
      return res.status(400).send("Unauthorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

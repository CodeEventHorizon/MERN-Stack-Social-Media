import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middlewares
import { requireSignin, postChangable } from "../middlewares";
// controllers
import {
  sharePost,
  allPosts,
  renderNewsFeed,
  likeThePost,
  unlikeThePost,
  commentOnPost,
  removeTheComment,
  uploadPicture,
  oneUserPost,
  changePost,
  deleteThePost,
  //  posts,
} from "../controllers/posting";

router.post("/share-post", requireSignin, sharePost);
router.post(
  "/upload-picture",
  formidable({ maxFileSize: 22 * 1024 * 1024 }),
  requireSignin,
  uploadPicture
);
router.get("/user-posts", requireSignin, allPosts);
router.get("/user-post/:_id", requireSignin, oneUserPost);
router.put("/update-post/:_id", requireSignin, postChangable, changePost);
router.delete(
  "/delete-post/:_id",
  requireSignin,
  postChangable,
  deleteThePost
);

router.get("/news-feed", requireSignin, renderNewsFeed);

router.put("/like-post", requireSignin, likeThePost);
router.put("/unlike-post", requireSignin, unlikeThePost);

router.put("/add-comment", requireSignin, commentOnPost);
router.put("/remove-comment", requireSignin, removeTheComment);

module.exports = router;

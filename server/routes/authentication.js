import express from "express";

const router = express.Router();

// middlewares
import { requireSignin } from "../middlewares";
// controllers
import {
  register,
  login,
  thisUser,
  forgotPassword,
  profileChange,
  findUsers,
  addFollower,
  followUser,
  followingUser,
  removeFollowerUser,
  unfollowUser,
  findUser,
  getUser,
  checkForAllUsers,
} from "../controllers/authentication";

router.post("/register", register);
router.post("/login", login);
router.get("/this-user", requireSignin, thisUser);
router.post("/forgot-password", forgotPassword);

router.put("/profile-change", requireSignin, profileChange);
router.get("/find-users", requireSignin, findUsers);

router.put("/follow-user", requireSignin, addFollower, followUser);
router.put("/unfollow-user", requireSignin, removeFollowerUser, unfollowUser);
router.get("/following-user", requireSignin, followingUser);

router.get("/search-user/:query", findUser);
router.get("/user/:username", getUser);

// testing
router.get("/check-all-users", requireSignin, checkForAllUsers);

module.exports = router;

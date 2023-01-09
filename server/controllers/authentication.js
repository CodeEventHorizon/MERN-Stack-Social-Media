import User from "../models/user";
import { hashThePassword, compareThePassword } from "../helpers/authentication";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

// REGISTER
// /api/register
export const register = async (req, res) => {
  const { name, email, password, secret } = req.body;

  if (!name) {
    return res.json({
      error: "Name is required",
    });
  }
  if (!password || password.length < 6) {
    return res.json({
      error: "Password is required and should be 6 characters long",
    });
  }
  if (!secret) {
    return res.json({
      error: "Answer is required",
    });
  }
  const exist = await User.findOne({ email });
  if (exist) {
    return res.json({
      error: "Email is taken",
    });
  }

  // hash password
  const hashedPassword = await hashThePassword(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    secret,
    username: nanoid(10),
  });

  try {
    await user.save();
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Register failed ", err);
    return res.status(400).send("Error, Try Again");
  }
};

// LOGIN
// /api/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if db has user with that email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found!",
      });
    }
    // check password
    const match = await compareThePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong Password",
      });
    }
    // Create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try Again!");
  }
};

// /api/this-user
export const thisUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// FORGOT PASSWORD
// /api/forgot-password
export const forgotPassword = async (req, res, next) => {
  const { email, newPassword, secret } = req.body;
  // validation
  if (!newPassword || newPassword.length < 6) {
    return res.json({
      error: "New password is required and should be less than 6 characters",
    });
  }
  if (!secret) {
    return res.json({
      error: "Secret is required",
    });
  }
  const user = await User.findOne({ email, secret });
  if (!user) {
    return res.json({
      error: "Wrong Credentials!",
    });
  }

  try {
    const hashed = await hashThePassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      success: "Password Changed!",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Error!",
    });
  }
};

// /api/profile-change
export const profileChange = async (req, res) => {
  try {
    const data = {};
    if (req.body.username) {
      data.username = req.body.username;
    }
    if (req.body.about) {
      data.about = req.body.about;
    }
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.json({
          error: "Password is required and should be 6 characters long",
        });
      } else {
        data.password = await hashThePassword(req.body.password);
      }
    }
    if (req.body.secret) {
      data.secret = req.body.secret;
    }

    let user = await User.findByIdAndUpdate(req.user._id, data, { new: true });
    user.password = undefined;
    user.secret = undefined;
    res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res.json({ error: "Duplicate Username" });
    }
    console.log(err);
  }
};

// /api/find-users
export const findUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // user.following
    let following = user.following;
    following.push(user._id);
    const people = await User.find({ _id: { $nin: following } }).limit(10);
    res.json(people);
  } catch (err) {
    console.log(err);
  }
};

// Middleware

// /api/follow-user
export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.user._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

// /api/follow-user
export const followUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

// /api/following-user
export const followingUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = await User.find({ _id: user.following }).limit(200);
    res.json(following);
  } catch (err) {
    console.log(err);
  }
};

// /api/unfollow-user
export const removeFollowerUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.user._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

// /api/unfollow-user
export const unfollowUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

// /api/search-user/${query}
// Another way of searching users but this one includes the state user too
// currently not in use
export const findUser = async (req, res) => {
  const { query } = req.params;
  if (!query) return;
  try {
    // $regex is special method from mongodb
    // The i modifier is used to perform case-insensitive matching.
    const user = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

// /api/user/${username}
// returns user by username (for profile)
export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -secret"
    ); // deselect password and secret
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

// /api/check-all-users?search=${keyword}
// returns all matched users by name and username
export const checkForAllUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            {
              name: { $regex: req.query.search, $options: "i" },
            },
            {
              username: { $regex: req.query.search, $options: "i" },
            },
          ],
        }
      : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

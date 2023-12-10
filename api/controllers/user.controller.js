const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Listing = require("../models/listing.model");

const updateUser = async (req, res, next) => {
  try {
    console.log(req.body);
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can only update your own account!"));
    }
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    console.log(updatedUser);
    const {
      _id,
      username: usernameDB,
      email: emailDB,
      avatar: avatarDB,
    } = updatedUser;

    res.status(200).json({
      success: true,
      message: "Valid user",
      username: usernameDB,
      email: emailDB,
      avatar: avatarDB,
      _id,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own acccount!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).clearCookie("access_token").json({
      success: true,
      message: "User has been deleted!",
    });
  } catch (err) {
    next(err);
  }
};

const getUserListing = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
  try {
    const listings = await Listing.find({ userRef: req.user.id });
    res.status(200).json({
      success: true,
      listings,
    });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    const {
      _id,
      username: usernameDB,
      email: emailDB,
      avatar: avatarDB,
    } = user;

    res.status(200).json({
      success: true,
      message: "Valid user",
      username: usernameDB,
      email: emailDB,
      avatar: avatarDB,
      _id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateUser, deleteUser, getUserListing, getUser };

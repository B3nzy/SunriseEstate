const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials!"));
    }
    const token = jwt.sign(
      {
        id: validUser.id,
      },
      process.env.JWT_SECRET_KEY
    );
    const {
      _id,
      username: usernameDB,
      email: emailDB,
      avatar: avatarDB,
    } = validUser;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
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

const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT_SECRET_KEY
      );
      const {
        _id,
        username: usernameDB,
        email: emailDB,
        avatar: avatarDB,
      } = user;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          success: true,
          message: "Valid user",
          username: usernameDB,
          email: emailDB,
          avatar: avatarDB,
          _id,
        });
    } else {
      const generatedPass =
        (Math.random() + 1).toString(36).substring(7) +
        (Math.random() + 1).toString(36).substring(7);
      console.log(generatedPass);
      const hashedPassword = bcrypt.hashSync(generatedPass, 10);
      const newUserName =
        name.split(" ").join("").toLowerCase() +
        (Math.random() + 1).toString(36).substring(7);
      const newUser = new User({
        username: newUserName,
        email,
        password: hashedPassword,
        avatar: photo,
      });
      const userData = await newUser.save();
      // console.log(userData);

      const token = jwt.sign(
        {
          id: userData.id,
        },
        process.env.JWT_SECRET_KEY
      );
      const {
        _id,
        username: usernameDB,
        email: emailDB,
        avatar: avatarDB,
      } = userData;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          success: true,
          message: "Valid user",
          username: usernameDB,
          email: emailDB,
          avatar: avatarDB,
          _id,
        });
    }
  } catch (err) {
    next(err);
  }
};

const signout = async (req, res, next) => {
  try {
    res.status(200).clearCookie("access_token").json({
      success: true,
      message: "User has been logged out!",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, signin, google, signout };

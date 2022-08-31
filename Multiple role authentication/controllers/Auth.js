const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../model/user");
const { SECRET } = require("../config/secret");
const cookie = require("cookie");

const registerUserFunc = async (userDets, role, res) => {
  try {
    // Validating the  username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: "Your requested username is already taken.",
        success: false,
      });
    }

    // validating the email
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: "Acccount with this email is already exist.",
        success: false,
      });
    }

    // hashing the  password
    const password = await bcrypt.hash(userDets.password, 12);
    // create a new user
    const newUser = new User({
      ...userDets,
      password,
      role,
    });

    await newUser.save();
    return res.status(201).json({
      message: "You are successfully registred. now login.",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const loginUserFunc = async (userCreds, role, res) => {
  let { username, password } = userCreds;
  //  username database ma xa ki xaina check
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "Username is not exist. Invalid login credentials.",
      success: false,
    });
  }
  if (user.role !== role) {
    return res.status(403).json({
      message: "Who you are , know and come through right route",
      success: false,
    });
  }
  // check for the password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("jwt", String(result.token), {
        httpOnly: true,
        maxAge: 60 * 60,
      })
    );

    return res.status(200).json({
      ...result,
      message: "Hurray! You are now logged in.",
      success: true,
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
      success: false,
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const userAuth = passport.authenticate("jwt", { session: false });

const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  userAuth,
  checkRole,
  loginUserFunc,
  registerUserFunc,
  serializeUser,
};

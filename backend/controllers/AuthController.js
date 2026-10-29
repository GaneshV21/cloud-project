const randomize = require("randomize");
const User = require("../models/User");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/jwt");

exports.Signup = async function (req, res, next) {
  try {
    let { name, email, password } = req.body;
    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        data: {},
        message: "User already Exist",
      });
    }
    let user_id = randomize("00000");
    const newUser = await User.create({
      user_id,
      name,
      email,
      password: await hashPassword(password),
    });
    const userData = newUser.toJSON();
    sanitizeUser(userData);

    return res.status(201).json({
      data: userData,
      message: "User registered Successfully",
    });
  } catch (err) {
    next(err);
  }
};

function sanitizeUser(user) {
  ["_id", "password", "__v"].forEach((field) => delete user[field]);
}

exports.Login = async function (req, res, next) {
  try {
    let { email, password } = req.body;
    let existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(404).json({
        data: {},
        message: "User not Found",
      });
    }
    let passwordCheck = await comparePassword(password, existUser?.password);
    if (!passwordCheck) {
      return res.status(400).json({
        data: {},
        message: "Verify the username and password are correct or not",
      });
    }

    let token = generateToken({
      id: existUser._id,
      name: existUser?.name,
      email: existUser?.email,
    });
    let userData = existUser.toJSON();
    sanitizeUser(userData);
    userData.token = token;
    return res.status(200).json({
      data: userData,
      message: "success",
    });
  } catch (err) {
    next(err);
  }
};

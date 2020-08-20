import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  sendBadRequestError,
  sendError,
  sendSuccess,
} from "../utils/universalFunctions";

// Models
const User = require("../models/user");

// Validations
const { registerValidation, loginValidation } = require("../validations/auth");

// Function to REGISTER a new USER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validating the user details
    const { error } = registerValidation(req.body);
    if (error) return res.send(sendBadRequestError(error));

    // Check if the user already exist
    const emailExist = await User.findOne({ email });
    if (emailExist)
      return sendError(
        { statusCode: 400, message: "Email already exist" },
        res
      );

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Adding user to DB
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = generateAccessToken(user._id);
    savedUser.password = undefined;
    // savedUser.token = token;
    // res.send(savedUser);

    res.header("auth-token", token).send(token);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Function to LOGIN a current USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validating the user details
  const { error } = loginValidation(req.body);
  if (error) return res.send(error.details[0].message);

  // Check if the user exist or not
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Email doesnot exists !");

  // Check if the password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Password is incorrect");

  const token = generateAccessToken(user._id);

  res.header("auth-token", token).send(token);
};

// Function to generate new JWT token
const generateAccessToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: "30s",
  });
};

// Funtion to check if JWT token is valid or not
const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = { registerUser, loginUser, verifyToken };

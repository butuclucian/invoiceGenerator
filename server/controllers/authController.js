import jwt from "jsonwebtoken";
import User from "../models/User.js";

import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import Subscription from "../models/Subscription.js";
import Notification from "../models/Notification.js";

// 🔧 funcție helper pentru token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 📌 Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Please fill all fields" });

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// 📌 Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// 📌 Get user profile (requires auth)
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// =======================
// UPDATE USER PROFILE
// =======================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== userId.toString()) {
      return res.status(400).json({ message: "Email already used by another account." });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Profile updated.",
      user: updated,
      token: generateToken(updated._id),
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Failed to update profile." });
  }
};

// =======================
// DELETE ACCOUNT
// =======================
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await Invoice.deleteMany({ user: userId });
    await Client.deleteMany({ createdBy: userId });
    await Subscription.deleteMany({ user: userId });
    await Notification.deleteMany({ user: userId });

    await User.findByIdAndDelete(userId);

    return res.json({
      success: true,
      message: "Account deleted successfully.",
    });

  } catch (err) {
    console.error("Delete Account Error:", err);
    res.status(500).json({ message: "Failed to delete account." });
  }
};

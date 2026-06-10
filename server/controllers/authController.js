import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // 🔥 IMPORTĂ BCRYPT PENTRU VALIDARE DIRECTĂ
import User from "../models/User.js";
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import Subscription from "../models/Subscription.js";
import Notification from "../models/Notification.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "CheiaTaSecretaDeRezerva2026", { expiresIn: "30d" });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Please fill all fields" });

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // 🛑 MODIFICARE: Trimitem password direct brută. 
    // Modelul User.js se va ocupa singur de criptare prin hook-ul pre('save')
    const user = await User.create({ 
      name, 
      email, 
      password // trimis exact cum vine din frontend
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("❌ Eroare critică la Înregistrare:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🛑 MODIFICARE CRITICĂ: Adăugăm .select("+password") la căutare
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verificăm ce primește bcrypt (pentru logurile tale din Docker)
    console.log("Parolă trimisă:", !!password, "Hash din bază:", !!user.password);

    // Dacă din vreo eroare de schemă câmpul se numește altfel (ex: user.parola), 
    // verificăm și variantele alternative ca să nu mai dea niciodată crash 500
    const actualHash = user.password || user.parola; 

    if (!actualHash) {
      console.error("❌ Câmpul password este încă undefined în obiectul User!");
      return res.status(500).json({ message: "Database schema mismatch for password field." });
    }

    // Validare directă
    const isMatch = await bcrypt.compare(password, actualHash);

    if (isMatch) {
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
    console.error("❌ Eroare critică la Login:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ── 3. PRELUARE PROFIL ───────────────────────────────────────────────────────
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

// ── 4. ACTUALIZARE PROFIL ────────────────────────────────────────────────────
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

// ── 5. ȘTERGERE CONT ȘI DATE ASOCIATE ────────────────────────────────────────
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await Invoice.deleteMany({ user: userId });
    await Client.deleteMany({ user: userId });
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

// ── 6. ACTUALIZARE PAROLĂ (FIXĂ) ─────────────────────────────────────────────
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found." });

    // 🔥 Sincronizare și aici cu bcrypt direct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect." });

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("Update Password Error:", err);
    res.status(500).json({ message: "Failed to update password." });
  }
};
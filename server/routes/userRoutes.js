import express from "express";
import User from "../models/User.js";
import { getMe, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/sync", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!clerkId || !email)
      return res.status(400).json({ message: "Missing fields" });

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, email, name });
      console.log("✅ New user created:", user.email);
    } else {
      user.email = email;
      user.name = name;
      await user.save();
      console.log("🔄 User updated:", user.email);
    }

    res.status(200).json({ message: "User synced successfully", user });
  } catch (err) {
    console.error("❌ Error syncing user:", err);
    res.status(500).json({ message: "Server error syncing user" });
  }
});

router.get("/me", protect, getMe);
router.put("/me", protect, updateUser);

export default router;

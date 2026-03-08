import express from "express";
import { registerUser, loginUser, getProfile, updateProfile, deleteAccount, updatePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/profile", protect, getProfile);
router.put("/update", protect, updateProfile);
router.delete("/delete", protect, deleteAccount);
router.put("/password", protect, updatePassword);

export default router;

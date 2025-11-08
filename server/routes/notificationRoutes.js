import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  generateNearDueNotifications,
  getUserNotifications,
  markAllAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// 🔁 Generează notificări pentru facturi near due
router.get("/generate", protect, generateNearDueNotifications);

// 🔔 Obține notificările userului
router.get("/", protect, getUserNotifications);

// ✅ Marchează toate ca citite
router.put("/mark-read", protect, markAllAsRead);

export default router;

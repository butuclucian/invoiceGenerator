import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  generateNearDueNotifications,
  getUserNotifications,
  markAllAsRead,
  testPushNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// 🔁 Generează notificări pentru facturi near due
router.get("/generate", protect, generateNearDueNotifications);

// 🔔 Obține notificările userului
router.get("/", protect, getUserNotifications);

// ✅ Marchează toate ca citite
router.put("/mark-read", protect, markAllAsRead);

// TEST PUSH
router.get("/test-push", protect, testPushNotification); 

export default router;

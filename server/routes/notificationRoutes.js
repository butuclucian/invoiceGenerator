import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateNearDueNotifications, getUserNotifications, markAllAsRead, } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/generate", protect, generateNearDueNotifications);
router.get("/", protect, getUserNotifications);
router.put("/mark-read", protect, markAllAsRead); 

export default router;

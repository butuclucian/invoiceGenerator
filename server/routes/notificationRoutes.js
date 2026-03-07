import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateNearDueNotifications, getUserNotifications, markAllAsRead, testPushNotification} from "../controllers/notificationController.js";

const router = express.Router();

// genereaza notificari pentru facturi aproape de scadenta
router.get("/generate", protect, generateNearDueNotifications);

// obtine notificari pentru userul logat
router.get("/", protect, getUserNotifications);

// marcheaza toate notificari ca citite
router.put("/mark-read", protect, markAllAsRead);

// test push notification
router.get("/test-push", protect, testPushNotification); 

export default router;

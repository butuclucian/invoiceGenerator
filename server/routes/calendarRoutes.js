import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveCalendarNotes } from "../controllers/calendarController.js";

const router = express.Router();
router.post("/save", protect, saveCalendarNotes);
export default router;

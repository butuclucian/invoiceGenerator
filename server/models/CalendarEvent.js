import mongoose from "mongoose";

const CalendarEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  title: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("CalendarEvent", CalendarEventSchema);

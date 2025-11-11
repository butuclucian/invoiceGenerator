import User from "../models/User.js";

export const saveCalendarNotes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.calendarNotes = req.body.notes;
    await user.save();
    res.json({ message: "Notes saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save notes" });
  }
};

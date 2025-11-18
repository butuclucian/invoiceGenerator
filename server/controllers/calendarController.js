import CalendarEvent from "../models/CalendarEvent.js";

// Get all events for logged-in user
export const getEvents = async (req, res) => {
  const events = await CalendarEvent.find({ user: req.user._id }).sort("date");
  res.json(events);
};

// Create new event
export const addEvent = async (req, res) => {
  const { date, time, title } = req.body;

  const event = await CalendarEvent.create({
    user: req.user._id,
    date,
    time,
    title,
  });

  res.json(event);
};

// Update event
export const updateEvent = async (req, res) => {
  const { date, time, title } = req.body;

  const updated = await CalendarEvent.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { date, time, title },
    { new: true }
  );

  res.json(updated);
};

// Delete event
export const deleteEvent = async (req, res) => {
  await CalendarEvent.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  res.json({ success: true });
};

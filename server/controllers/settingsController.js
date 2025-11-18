import UserSettings from "../models/UserSettings.js";

export const getSettings = async (req, res) => {
  try {
    const userId = req.user._id;

    let settings = await UserSettings.findOne({ user: userId });

    if (!settings) {
      // create default settings
      settings = await UserSettings.create({ user: userId });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to load settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;

    const updated = await UserSettings.findOneAndUpdate(
      { user: userId },
      data,
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Settings updated",
      settings: updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};

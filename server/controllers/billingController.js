import BillingProfile from "../models/BillingProfile.js";

export const getBillingProfile = async (req, res) => {
  try {
    const profile = await BillingProfile.findOne({ user: req.user._id });
    res.json(profile || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to load billing profile" });
  }
};

export const updateBillingProfile = async (req, res) => {
  try {
    const updated = await BillingProfile.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, user: req.user._id },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Billing profile saved",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to save billing profile" });
  }
};

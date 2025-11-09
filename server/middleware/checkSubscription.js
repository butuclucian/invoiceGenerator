import Subscription from "../models/Subscription.js";

export const checkSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    if (!subscription || subscription.status !== "Active") {
      return res
        .status(403)
        .json({ message: "Access denied. Upgrade your plan to use AI features." });
    }
    next();
  } catch (err) {
    console.error("checkSubscription error:", err);
    res.status(500).json({ message: "Subscription check failed" });
  }
};

import User from "../models/User.js";

// @desc    Sync user from Clerk to MongoDB
// @route   POST /api/users/sync
// @access  Public (Clerk token verified on frontend)
export const syncUser = async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, email, name });
      console.log(`✅ Synced new user: ${email}`);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error syncing user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user info" });
  }
};

// ✅ Update profile settings
export const updateUser = async (req, res) => {
  try {
    const { name, email, notifications, darkMode } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.notifications = notifications ?? user.notifications;
    user.darkMode = darkMode ?? user.darkMode;

    const updatedUser = await user.save();
    res.json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        notifications: updatedUser.notifications,
        darkMode: updatedUser.darkMode,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};
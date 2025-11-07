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

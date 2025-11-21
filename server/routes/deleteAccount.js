router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    await Invoice.deleteMany({ user: userId });
    await Client.deleteMany({ user: userId });
    await Subscription.deleteOne({ user: userId });
    await User.deleteOne({ _id: userId });

    res.json({ message: "Account and all related data permanently deleted." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting account" });
  }
});

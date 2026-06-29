import User from "../models/User.js";


export const syncUser = async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ message: "Missing required fields (clerkId or email)" });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ 
        clerkId, 
        email, 
        name,
        password: Math.random().toString(36).slice(-10)
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ message: "Server error during user sync", error: error.message });
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user info" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { name, email, billing_profile, pushToken } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.pushToken = pushToken !== undefined ? pushToken : user.pushToken;

    if (billing_profile) {
      user.billing_profile = {
        business_name: billing_profile.business_name ?? user.billing_profile.business_name,
        cif: billing_profile.cif ?? user.billing_profile.cif,
        address: billing_profile.address ?? user.billing_profile.address,
        phone: billing_profile.phone ?? user.billing_profile.phone,
        email: billing_profile.email ?? user.billing_profile.email,
        iban: billing_profile.iban ?? user.billing_profile.iban,
        bank: billing_profile.bank ?? user.billing_profile.bank,
        vat_rate: billing_profile.vat_rate ?? user.billing_profile.vat_rate,
        currency: billing_profile.currency ?? user.billing_profile.currency,
        logo: billing_profile.logo ?? user.billing_profile.logo,
      };
    }

    const updatedUser = await user.save();
    
    res.json({
      message: "User and billing profile updated successfully",
      user: {
        _id: updatedUser._id,
        clerkId: updatedUser.clerkId,
        name: updatedUser.name,
        email: updatedUser.email,
        pushToken: updatedUser.pushToken,
        billing_profile: updatedUser.billing_profile,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user profile", error: err.message });
  }
};
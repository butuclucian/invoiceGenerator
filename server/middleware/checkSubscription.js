import Subscription from "../models/Subscription.js";

export const checkEnterpriseSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    if (!subscription || subscription.status !== "Active" || subscription.plan !== "Enterprise") {
      return res
        .status(403)
        .json({ 
          success: false, 
          message: "Acces refuzat. Funcționalitatea AI este disponibilă doar pentru planul Enterprise." 
        });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Eroare la verificarea abonamentului" });
  }
};
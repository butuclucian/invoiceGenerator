import Subscription from "../models/Subscription.js";

export const checkEnterpriseSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    
    // Log-uri pentru debug (se vor vedea în consola de la Render)
    console.log("Subscripție găsită:", subscription); 
    
    if (!subscription || subscription.status !== "Active" || subscription.plan !== "Enterprise") {
      console.log("Acces refuzat. Status/Plan nu corespunde.");
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Eroare la verificarea abonamentului" });
  }
};
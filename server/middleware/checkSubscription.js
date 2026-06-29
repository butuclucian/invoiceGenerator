import Subscription from "../models/Subscription.js";

export const checkEnterpriseSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });
    
    console.log("Subscripție găsită:", subscription); 
    
    if (!subscription || subscription.status !== "Active" || subscription.plan !== "Enterprise") {
      return res.status(403).json({ 
        success: false, 
        message: "Acces refuzat. Abonament Enterprise activ necesar." 
      });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ message: "Eroare la verificarea abonamentului" });
  }
};
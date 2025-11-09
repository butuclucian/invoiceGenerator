import Stripe from "stripe";
import dotenv from "dotenv";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ 1. Creează o sesiune de checkout pentru upgrade
export const createCheckoutSession = async (req, res) => {
  try {
    console.log("🔹 createCheckoutSession user:", req.user);
    console.log("🔹 req.body:", req.body);

    const { plan } = req.body;
    const normalizedPlan = plan?.toLowerCase();

    const priceId =
      normalizedPlan === "enterprise"
        ? process.env.STRIPE_PRICE_ENTERPRISE
        : process.env.STRIPE_PRICE_PRO;

    if (!priceId)
      return res.status(400).json({ message: "Invalid subscription plan" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/subscription?canceled=true`,
      customer_email: req.user.email,
      metadata: {
        userId: String(req.user._id), // ✅ convertim în string
        plan: normalizedPlan,
      },
    });

    console.log("✅ Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe session error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};



// ✅ 2. Webhook handler (Stripe → App)
export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const customerEmail = data.customer_email;
        const user = await User.findOne({ email: customerEmail });
        if (user) {
          await Subscription.findOneAndUpdate(
            { user: user._id },
            {
              stripeCustomerId: data.customer,
              stripeSubscriptionId: data.subscription,
              plan: data.amount_total <= 900 ? "Pro" : "Enterprise",
              status: "Active",
              renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            { upsert: true, new: true }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = await Subscription.findOne({
          stripeSubscriptionId: data.id,
        });
        if (sub) {
          sub.status = "Cancelled";
          await sub.save();
        }
        break;
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handling failed:", err);
    res.status(500).send("Webhook handler error");
  }
};

// ✅ 3. Obține datele curente ale subscriptiei
export const getMySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id });
    if (!sub) {
      return res.json({
        plan: "Free",
        status: "Inactive",
      });
    }
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscription data" });
  }
};

// ✅ 4. Anulează abonamentul activ
export const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id });
    if (!sub || !sub.stripeSubscriptionId) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
    sub.status = "Cancelled";
    await sub.save();

    res.json({ message: "Subscription cancelled successfully" });
  } catch (err) {
    console.error("❌ Cancel subscription error:", err);
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
};

import Stripe from "stripe";
import dotenv from "dotenv";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { plan } = req.body;
    const normalizedPlan = plan?.toLowerCase();

    const priceId =
      normalizedPlan === "enterprise"
        ? process.env.STRIPE_PRICE_ENTERPRISE
        : process.env.STRIPE_PRICE_PRO;

    if (!priceId) {
      return res.status(400).json({ message: "Missing Stripe price ID" });
    }

    if (!process.env.CLIENT_URL) {
      return res.status(500).json({ message: "CLIENT_URL missing" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/subscription?canceled=true`,
      customer_email: req.user.email,
      metadata: {
        userId: String(req.user._id),
        plan: normalizedPlan,
      },
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return res.status(500).json({
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};

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
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  try {
    console.log(`📥 [Webhook] Eveniment primit: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        // Obținem email-ul din surse multiple pentru siguranță
        const email = data.customer_email || data.customer_details?.email;
        const planMeta = data.metadata?.plan || "pro";

        console.log(`🔍 Caut user cu email: ${email}`);
        
        const user = await User.findOne({ email: email?.toLowerCase() });

        if (user) {
          const updated = await Subscription.findOneAndUpdate(
            { user: user._id },
            {
              user: user._id,
              stripeCustomerId: data.customer || "",
              stripeSubscriptionId: data.subscription || "",
              plan: planMeta.charAt(0).toUpperCase() + planMeta.slice(1),
              status: "Active",
              renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            { upsert: true, new: true }
          );
          console.log(`✅ Subscription actualizat în DB pentru ${user.email}`);
        } else {
          console.error(`❌ EROARE: Nu am găsit niciun user cu emailul: ${email}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subId = data.id;
        const sub = await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: subId },
            { status: "Cancelled" }
        );
        if (sub) console.log("✅ Abonament anulat în DB");
        break;
      }

      default:
        console.log(`ℹ Eveniment neprocesat: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handling failed:", err);
    res.status(500).send("Webhook handler error");
  }
};

// 3. Obbine datele curente ale subscriptiei
export const getMySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id });
    if (!sub) {
      return res.json({ plan: "Free", status: "Inactive" });
    }
    res.json(sub);
  } catch (err) {
    console.error("getMySubscription error:", err);
    res.status(500).json({ message: "Failed to fetch subscription data" });
  }
};

// 4. Anuleaza abonamentul activ
export const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id });
    if (!sub || !sub.stripeSubscriptionId)
      return res.status(404).json({ message: "Subscription not found" });

    await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
    sub.status = "Cancelled";
    await sub.save();

    res.json({ message: "Subscription cancelled successfully" });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
};

//  5. Open Billing Portal
export const createBillingPortal = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id });
    if (!sub || !sub.stripeCustomerId)
      return res.status(404).json({ message: "No active subscription found" });

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/dashboard/billing`,
    });

    res.json({ url: portalSession.url });
  } catch (err) {
    console.error("Billing portal error:", err);
    res.status(500).json({ message: "Failed to create billing portal session" });
  }
};

// 6. Fetch Stripe invoices for user
export const getInvoices = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id });
    if (!sub || !sub.stripeCustomerId)
      return res.status(404).json({ message: "No invoices found" });

    const invoices = await stripe.invoices.list({
      customer: sub.stripeCustomerId,
      limit: 5,
    });

    res.json(invoices.data);
  } catch (err) {
    console.error("Invoice fetch error:", err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

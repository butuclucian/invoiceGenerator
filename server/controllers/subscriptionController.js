import Stripe from "stripe";
import dotenv from "dotenv";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// creeaza o sesiune de checkout pentru upgrade
export const createCheckoutSession = async (req, res) => {
  try {
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
        userId: String(req.user._id),
        plan: normalizedPlan,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

//  Webhook handler
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
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  try {
    switch (event.type) {
      //  Caz 1: Checkout finalizat
      case "checkout.session.completed": {
        const email = data.customer_email;
        const planMeta = data.metadata?.plan || "pro";

        const user = await User.findOne({ email });
        if (user) {
          const updated = await Subscription.findOneAndUpdate(
            { user: user._id },
            {
              user: user._id,
              stripeCustomerId: data.customer || "",
              stripeSubscriptionId: data.subscription || "",
              plan:
                planMeta === "enterprise"
                  ? "Enterprise"
                  : "Pro",
              status: "Active",
              renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            { upsert: true, new: true }
          );
          console.log(`Subscription created/updated for ${user.email}: ${updated.plan}`);
        } else {
          console.warn("No user found for email:", email);
        }
        break;
      }

      // Caz 2: Subscriptie noua (Stripe Customer -> Subscription)
      case "customer.subscription.created": {
        const sub = data;
        const customerId = sub.customer;

        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;
        const user = await User.findOne({ email });

        if (user) {
          const updated = await Subscription.findOneAndUpdate(
            { user: user._id },
            {
              user: user._id,
              stripeCustomerId: customerId,
              stripeSubscriptionId: sub.id,
              plan:
                sub.items.data[0].price.id === process.env.STRIPE_PRICE_ENTERPRISE
                  ? "Enterprise"
                  : "Pro",
              status: sub.status === "active" ? "Active" : "Pending",
              renewal_date: new Date(sub.current_period_end * 1000),
            },
            { upsert: true, new: true }
          );
          console.log(`Subscription synced for ${user.email}: ${updated.plan}`);
        } else {
          console.warn("No user found for customer email:", email);
        }
        break;
      }

      //  Caz 3: Subscriptie stearsa / anulata
      case "customer.subscription.deleted": {
        const subId = data.id;

        const sub = await Subscription.findOne({
          stripeSubscriptionId: subId,
        });
        if (sub) {
          sub.status = "Cancelled";
          await sub.save();
          console.log("Subscription cancelled for user:", sub.user);
        }
        break;
      }

      default:
        console.log(`ℹUnhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handling failed:", err);
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

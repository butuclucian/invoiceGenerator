import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    plan: { type: String, enum: ["Free", "Pro", "Enterprise"], default: "Free" },
    status: { type: String, default: "Inactive" },
    renewal_date: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);

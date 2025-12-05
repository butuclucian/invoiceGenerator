import mongoose from "mongoose";

const billingProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  business_name: String,
  fiscal_code: String,
  address: String,
  phone: String,
  email: String,
  bank: String,
  iban: String,
  vat_rate: { type: Number, default: 19 },
  currency: { type: String, default: "RON" },
  logo: String,
}, { timestamps: true });

export default mongoose.model("BillingProfile", billingProfileSchema);

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
  registration_number: String,
  vat_number: String,

  address: String,
  city: String,
  county: String,
  postal_code: String,
  country: {
    type: String,
    default: "Romania",
  },

  phone: String,
  email: String,
  website: String,

  bank: String,
  iban: String,
  cif: String,
  swift: String,

  vat_rate: {
    type: Number,
    default: 19,
  },

  currency: {
    type: String,
    default: "RON",
  },

  logo: String,
}, {
  timestamps: true,
});

export default mongoose.model("BillingProfile", billingProfileSchema);
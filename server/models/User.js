import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const billingProfileSchema = new mongoose.Schema({
  business_name: { type: String, default: "" },
  cif: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  iban: { type: String, default: "" },
  bank: { type: String, default: "" },
  vat_rate: { type: Number, default: 19 },
  currency: { type: String, default: "RON" },
  logo: { type: String, default: "" },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    
    pushToken: { type: String, default: null },

    billing_profile: { type: billingProfileSchema, default: () => ({}) },
  },
  { timestamps: true }
);

//  Hash parola înainte de salvare
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compara parola introdusă cu cea hash-uită
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

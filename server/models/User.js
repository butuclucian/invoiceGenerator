import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const billingProfileSchema = new mongoose.Schema(
  {
    business_name: { type: String, default: "" },

    // Cod fiscal (RO / CIF / CUI)
    cif: { type: String, default: "" },

    // Cod TVA separat (important în UE)
    vat_number: { type: String, default: "" },

    // Registrul comerțului (J35/123/2025)
    registration_number: { type: String, default: "" },

    address: { type: String, default: "" },
    city: { type: String, default: "" },
    county: { type: String, default: "" },
    country: { type: String, default: "Romania" },

    phone: { type: String, default: "" },
    email: { type: String, default: "" },

    website: { type: String, default: "" },

    iban: { type: String, default: "" },
    bank: { type: String, default: "" },
    swift: { type: String, default: "" },

    vat_rate: { type: Number, default: 19 },
    currency: { type: String, default: "RON" },

    logo: { type: String, default: "" },

    // opțional pentru PDF branding
    stamp: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    pushToken: {
      type: String,
      default: null,
    },

    // EMBEDDED billing profile (MVP friendly)
    billing_profile: {
      type: billingProfileSchema,
      default: {},
    },

    // FUTURE: roluri (AI / admin / user)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Hash password before save
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/**
 * Compare passwords
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
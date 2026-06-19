import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const billingProfileSchema = new mongoose.Schema(
  {
    business_name: { type: String, default: "", trim: true},
    cif: { type: String, default: "", trim: true},
    registration_number: { type: String, default: "", trim: true},
    address: { type: String, default: ""},
    iban: { type: String, default: "", uppercase: true, trim: true},
    bank: { type: String, default: "", trim: true},
    phone: { type: String, default: "",},
    email: { type: String, default: "", lowercase: true, trim: true},
    logo: { type: String, default: "" },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true},
    email: { type: String, required: true, unique: true, lowercase: true, trim: true},
    password: { type: String, required: true, minlength: 6, select: false,},
    pushToken: { type: String, default: null},
    billing_profile: { type: billingProfileSchema, default: {}},
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },},
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const billingProfileSchema = new mongoose.Schema(
  {
    // Numele oficial (ex: POPESCU ION PFA sau Cabinet de Avocat Popescu)
    business_name: { 
      type: String, 
      default: "",
      trim: true 
    },

    // Codul de Identificare Fiscală (CIF / CUI) - include RO doar dacă e înregistrat în scopuri de TVA
    cif: { 
      type: String, 
      default: "", 
      trim: true 
    },

    // Nr. de înregistrare la Registrul Comerțului (ex: F35/123/2026 pentru PFA-uri)
    // Rămâne gol dacă freelancerul este PFI (profesii liberale, traducători, medici etc.)
    registration_number: { 
      type: String, 
      default: "", 
      trim: true 
    },

    // Adresa completă a sediului profesional (Sediu social / Domiciliu fiscal)
    address: { 
      type: String, 
      default: "" 
    },

    // Contul IBAN unde freelancerul își va încasa banii de la clienți
    iban: { 
      type: String, 
      default: "", 
      uppercase: true, 
      trim: true 
    },

    // Numele băncii la care este deschis contul IBAN
    bank: { 
      type: String, 
      default: "",
      trim: true
    },

    // Date de contact rapide care vor fi printate pe factură
    phone: { 
      type: String, 
      default: "" 
    },
    email: { 
      type: String, 
      default: "",
      lowercase: true,
      trim: true
    },

    // Logo-ul companiei (opțional, pentru branding pe PDF-ul facturii)
    logo: { 
      type: String, 
      default: "" 
    },
  },
  { _id: false } // Împiedică Mongoose să creeze un _id separat pentru acest sub-document
);

const userSchema = new mongoose.Schema(
  {
    // Numele utilizatorului (folosit în interiorul aplicației/SaaS-ului)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Email-ul de logare în aplicație
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Parola contului (select: false împiedică trimiterea ei accidentală în API-uri)
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // Pentru notificările push din aplicație
    pushToken: {
      type: String,
      default: null,
    },

    // Profilul de facturare embedded (structura de mai sus)
    billing_profile: {
      type: billingProfileSchema,
      default: {},
    },

    // Rolul în platformă (util pentru când vei vrea să adaugi un panou de Admin)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Permite suspendarea contului dacă este necesar
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Creează automat câmpurile createdAt și updatedAt
);

/**
 * Hash password înainte de salvarea în baza de date
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/**
 * Metodă helper pentru verificarea parolei la login
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  name: { type: String, required: true },
  brand: { type: String, default: "" },
  cui: { type: String, default: "" },
  reg_com: { type: String, default: "" },
  client_code: { type: String, default: "" },
  is_tva_payer: { type: Boolean, default: false },

  address: { type: String, default: "" },
  city: { type: String, default: "" },
  county: { type: String, default: "" },
  country: { type: String, default: "Romania" },

  iban: { type: String, default: "" },
  bank: { type: String, default: "" },

  contact_person: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);
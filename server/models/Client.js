import mongoose from "mongoose";
// În src/models/Client.js
const clientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, default: "" },
  company: { type: String, default: "" },
  address: { type: String, default: "" },
  
  // MODIFICĂ AICI: Schimbă din true în false sau elimină complet linia 'required'
  cui: { type: String, required: false, default: "" },
  city: { type: String, required: false, default: "" },
  county: { type: String, required: false, default: "" }
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);
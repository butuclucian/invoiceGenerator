import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    
    email: {
      type: String,
      required: false,
      default: "",
    },

    company: {
      type: String,
      required: false,
      default: ""
    },

    cui: {
      type: String,
      required: false,
      default: ""
    },

    address: {
      type: String,
      required: false,
      default: ""
    },

    phone: {
      type: String,
      required: false,
      default: ""
    },

    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
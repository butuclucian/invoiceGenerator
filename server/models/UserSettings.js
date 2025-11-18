import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // UI Settings
    theme: { type: String, default: "dark" },         
    accentColor: { type: String, default: "#80FFF9" },
    sidebarBehavior: { type: String, default: "fixed" },
    density: { type: String, default: "normal" }, 

    // Notifications
    emailNotifications: { type: Boolean, default: true },
    notifyInvoicePaid: { type: Boolean, default: true },
    notifyInvoiceOverdue: { type: Boolean, default: true },
    notifyAIInvoice: { type: Boolean, default: true },
    notificationFrequency: { type: String, default: "instant" },

    // AI Settings
    aiTone: { type: String, default: "friendly" }, 
    aiLength: { type: String, default: "normal" },  
  },
  { timestamps: true }
);

export default mongoose.model("UserSettings", userSettingsSchema);

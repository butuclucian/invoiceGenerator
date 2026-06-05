import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  unit_price: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  total: { 
    type: Number, 
    required: true, 
    default: 0 
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: false, 
    },

    invoice_number: { 
      type: String, 
      required: false 
    }, 
    
    date: { 
      type: Date, 
      required: true, 
      default: Date.now 
    },
    
    due_date: { 
      type: Date 
    },
    
    status: {
      type: String,
      enum: ["pending", "draft", "sent", "paid", "overdue"],
      default: "draft",
    },
    
    items: [itemSchema],
    
    tax_rate: { 
      type: Number, 
      default: 0 
    },
    
    discount_rate: { 
      type: Number, 
      default: 0 
    },
    
    subtotal: { 
      type: Number, 
      default: 0 
    },
    
    total: { 
      type: Number, 
      default: 0 
    },
    
    notes: { 
      type: String 
    },
    
    payment_terms: { 
      type: String 
    },

    ai_extracted_data: {
      cumparator: { type: String, default: "" },
      cui: { type: String, default: "" },
      sediu_social: { type: String, default: "" },
      serviciu_prestat: { type: String, default: "" },
      suma: { type: Number, default: 0 },
      valuta: { type: String, default: "EUR" },
      mesaj_notificare: { type: String, default: "" }
    },

    recurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      default: "monthly",
    },
    next_billing: {
      type: Date,
    },
  },
  { 
    timestamps: true
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
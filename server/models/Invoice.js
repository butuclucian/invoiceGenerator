import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    // 🔐 Securitate & Relații
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

    // 🧾 Identificare Factură
    series: { 
      type: String, 
      default: "INV" 
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

    // 📦 Produse / Servicii Billed Inline
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unit_price: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true, default: 0 }
      }
    ],
    
    // 📊 Valori Fiscale & Calcule
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
      required: true,
      default: 0 
    },
    total: { 
      type: Number, 
      required: true,
      default: 0 
    },
    currency: {
      type: String,
      default: "RON"
    },

    // 💳 Status Încasări (Utilizat de AI Insights)
    payment_method: { 
      type: String, 
      enum: ["cash", "card", "bank_transfer", "not_paid", "stripe"], 
      default: "not_paid" 
    },
    paid_amount: { 
      type: Number, 
      default: 0 
    },
    paid_at: { 
      type: Date 
    },
    
    // 📝 Note adiționale
    notes: { 
      type: String,
      default: ""
    },
    payment_terms: { 
      type: String,
      default: ""
    },

    // 🤖 Automatizare SaaS: Recurență Facturi
    recurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      default: "monthly" // Am scos enum-ul rigid pentru flexibilitatea Llama
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
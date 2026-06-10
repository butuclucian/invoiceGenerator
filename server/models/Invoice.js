import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    // Legătura cu utilizatorul (Freelancerul logat)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Legătura cu clientul din baza de date
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
    
    // Produsele sau serviciile facturate (Structură inline curată)
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unit_price: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true, default: 0 }
      }
    ],
    
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

    // ADAUGAT: Valuta la nivel global de factură (Cerută de aiController)
    currency: {
      type: String,
      default: "RON"
    },
    
    notes: { 
      type: String,
      default: ""
    },
    
    payment_terms: { 
      type: String,
      default: ""
    },

    // Zona dedicată entităților extrase de Llama 3.1 rulate edge
    ai_extracted_data: {
      cumparator: { type: String, default: "" },
      cui: { type: String, default: "" },
      sediu_social: { type: String, default: "" },
      serviciu_prestat: { type: String, default: "" },
      suma: { type: Number, default: 0 },
      valuta: { type: String, default: "EUR" },
      mesaj_notificare: { type: String, default: "" }
    },

    // Zona dedicată automatizării facturilor recurente (Sincronizat cu Rezumatul)
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
    timestamps: true // Generează automat createdAt și updatedAt
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
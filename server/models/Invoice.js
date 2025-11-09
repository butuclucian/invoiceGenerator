import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unit_price: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
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
      required: true,
    },
    invoice_number: { type: String, required: true },
    date: { type: Date, required: true },
    due_date: { type: Date },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue"],
      default: "draft",
    },
    items: [itemSchema],
    tax_rate: { type: Number, default: 0 },
    discount_rate: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    notes: { type: String },
    payment_terms: { type: String },
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
  
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;

// src/assets/assets.js

// Dummy Clients
export const dummyClients = [
  {
    _id: "c001",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 555-234-6789",
    company: "TechNova Solutions",
    address: "245 Innovation Drive, San Francisco, CA, USA",
  },
  {
    _id: "c002",
    name: "Maria Popescu",
    email: "maria.popescu@creatix.ro",
    phone: "+40 720 654 321",
    company: "Creatix Studio",
    address: "Str. Mărășești 45, Timișoara, România",
  },
];

// Dummy Invoices
export const dummyInvoices = [
  {
    _id: "inv001",
    invoice_number: "INV-2025001",
    date: "2025-11-07",
    due_date: "2025-11-21",
    client_id: "c001",
    status: "sent",
    items: [
      {
        description: "Website redesign project",
        quantity: 1,
        unit_price: 1200,
        total: 1200,
      },
      {
        description: "Monthly SEO & Analytics",
        quantity: 1,
        unit_price: 300,
        total: 300,
      },
    ],
    subtotal: 1500,
    tax_rate: 10,
    discount_rate: 5,
    tax_amount: 150,
    discount_amount: 75,
    total: 1575,
    payment_terms: "Net 14",
    notes: "Payment via bank transfer to IBAN: RO49AAAA1B31007593840000",
  },
  {
    _id: "inv002",
    invoice_number: "INV-2025002",
    date: "2025-11-02",
    due_date: "2025-11-16",
    client_id: "c002",
    status: "draft",
    items: [
      {
        description: "Logo & Brand Kit Design",
        quantity: 1,
        unit_price: 800,
        total: 800,
      },
      {
        description: "Business Card Printing",
        quantity: 200,
        unit_price: 0.8,
        total: 160,
      },
    ],
    subtotal: 960,
    tax_rate: 19,
    discount_rate: 0,
    tax_amount: 182.4,
    discount_amount: 0,
    total: 1142.4,
    payment_terms: "Net 30",
    notes: "Please confirm final logo version before payment.",
    recurring: true,
    frequency: "Monthly",
    next_billing: "2025-12-01"

  },
];

// ✅ Default export (optional)
export default {
  dummyClients,
  dummyInvoices,
};

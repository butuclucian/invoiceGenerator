import React from "react";
import PageTemplate from "./PageTemplate";

const Pricing = () => {
  return (
    <PageTemplate
      title="Pricing & Billing"
      subtitle="Learn how billing works across all BillForgeAI plans."
    >
      <p className="mb-6">
        BillForgeAI offers monthly and yearly billing through secure Stripe payments.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">Supported plans</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>Free — Limited features</li>
        <li>Pro — Unlimited invoices & full AI access</li>
        <li>Enterprise — Team features & dedicated support</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">Billing Rules</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>Auto-renew every month unless canceled</li>
        <li>You may cancel anytime</li>
        <li>No surprise fees</li>
      </ul>
    </PageTemplate>
  );
};

export default Pricing;

import React from "react";
import PageTemplate from "./PageTemplate";

const Terms = () => {
  return (
    <PageTemplate
      title="Terms of Service"
      subtitle="Please review the terms governing the use of BillForgeAI."
    >
      <p className="mb-6">
        By accessing or using BillForgeAI, you acknowledge that you have read,
        understood, and agreed to be bound by these Terms of Service.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">1. Acceptance of Terms</h3>
      <p>
        The use of the BillForgeAI platform constitutes your acceptance of these terms.
        If you do not agree, please discontinue using the service immediately.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">2. Eligibility</h3>
      <p>
        You must be at least 16 years old to use BillForgeAI. If you are under 18,
        you must have parental or guardian consent.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">3. Account Responsibilities</h3>
      <ul className="list-disc ml-6 space-y-2 text-white/80">
        <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
        <li>You agree to notify us immediately if you suspect unauthorized access.</li>
        <li>You may not share your account or resell access to the platform.</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">4. Use of the Service</h3>
      <p>Users agree NOT to:</p>
      <ul className="list-disc ml-6 space-y-2 text-white/80">
        <li>Upload harmful or malicious files.</li>
        <li>Attempt to breach security or misuse the platform.</li>
        <li>Use AI-generated invoices for fraudulent or illegal purposes.</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">5. Payments & Subscriptions</h3>
      <p>
        Subscriptions renew automatically unless canceled. You can manage your
        subscription at any time in the dashboard. Refunds follow Stripe’s policies.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">6. Intellectual Property</h3>
      <p>
        BillForgeAI retains full ownership of the platform, branding, software,
        and AI generation models. Your data remains yours.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">7. Limitation of Liability</h3>
      <p>
        BillForgeAI is provided “as is” without warranties of any kind. We are not
        responsible for financial losses, missed payments, or incorrect invoices.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">8. Termination</h3>
      <p>
        We may suspend or terminate access if these terms are violated.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">9. Changes to Terms</h3>
      <p>
        We reserve the right to update these terms at any time. Continued use
        represents acceptance of any updates.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">10. Contact</h3>
      <p>
        For questions regarding these Terms, contact us at{" "}
        <span className="text-[#80FFF9]">legal@billforgeai.com</span>.
      </p>
    </PageTemplate>
  );
};

export default Terms;

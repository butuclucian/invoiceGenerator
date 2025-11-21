import React from "react";
import PageTemplate from "./PageTemplate";

const Privacy = () => {
  return (
    <PageTemplate
      title="Privacy Policy"
      subtitle="Your privacy matters. Learn how we collect, use, and protect your data."
    >
      <p className="mb-6">
        This Privacy Policy explains how BillForgeAI collects, stores, and uses
        your personal information when using our platform.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">1. Information We Collect</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>Account details: Name, email, password (encrypted)</li>
        <li>Invoice data you upload or generate</li>
        <li>Subscription/payment details via Stripe</li>
        <li>Analytics and device identifiers for performance</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">2. How We Use Your Data</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>To generate invoices using AI</li>
        <li>To improve platform performance</li>
        <li>To provide subscription services</li>
        <li>To prevent fraud and abuse</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">3. Cookies</h3>
      <p>
        We use essential, analytics, and preference cookies to provide a better user experience.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">4. Data Sharing</h3>
      <p>
        We do NOT sell your data. We only share information with secure, GDPR-compliant providers:
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>Stripe – Payments</li>
        <li>MongoDB Atlas – Database</li>
        <li>Google Cloud / Gemini – AI processing</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">5. Data Deletion</h3>
      <p>You may request account deletion anytime at support@billforgeai.com.</p>

      <h3 className="text-white font-semibold mt-10 mb-2">6. GDPR Rights</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>Right to access</li>
        <li>Right to delete</li>
        <li>Right to restrict processing</li>
        <li>Right to portability</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">7. Updates</h3>
      <p>This policy may change. Updates will be posted here.</p>
    </PageTemplate>
  );
};

export default Privacy;

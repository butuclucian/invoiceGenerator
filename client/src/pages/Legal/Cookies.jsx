import React from "react";
import PageTemplate from "./PageTemplate";

const Cookies = () => {
  return (
    <PageTemplate title="Cookie Policy" subtitle="How and why we use cookies on BillForgeAI." >
      <p className="mb-6">
        Cookies help us enhance your experience and improve platform performance.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">1. Types of Cookies</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>Essential cookies — login session & security</li>
        <li>Analytics cookies — product improvement</li>
        <li>Preference cookies — save your UI settings</li>
        <li>Essential Cookies — Required to operate the dashboard and authentication.</li>
        <li>Analytics Cookies — Optional. Used only if the user accepts.</li>
        <li>Preference Cookies — Save user settings like theme or filters.</li>
        <li>BillForgeAI DOES NOT use advertising cookies or third-party marketing trackers.</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">2. Third-Party Cookies</h3>
      <p>
        Stripe, Google Analytics, and Gemini may set cookies to support functionality.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">3. Cookie Control</h3>
      <p>You may disable cookies in your browser settings, but some features may break.</p>
    </PageTemplate>
  );
};

export default Cookies;

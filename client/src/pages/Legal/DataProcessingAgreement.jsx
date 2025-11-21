import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const DataProcessingAgreement = () => {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-10"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-6">Data Processing Agreement (DPA)</h1>
        <p className="text-gray-400 mb-10">
          Last updated: {new Date().toISOString().split("T")[0]}
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold">1. Purpose</h2>
            <p>
              This Data Processing Agreement governs how BillForgeAI processes
              personal data on behalf of the user in accordance with GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Roles</h2>
            <p>
              You (the user) are the Data Controller.  
              BillForgeAI (the developer) is the Data Processor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Scope of Processing</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Invoice generation & storage</li>
              <li>Client contact management</li>
              <li>AI invoice extraction (Gemini)</li>
              <li>User authentication & subscription management</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Processor Obligations</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Process data only under user instructions</li>
              <li>Implement industry-standard security measures</li>
              <li>Not sell or share personal data</li>
              <li>Provide tools for deletion/export upon request</li>
              <li>Notify users of security breaches</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Subprocessors</h2>
            <p>The following subprocessors may process your data:</p>
            <ul className="list-disc ml-6 space-y-2 mt-2">
              <li>MongoDB Atlas — hosting & database</li>
              <li>Stripe — billing & subscription management</li>
              <li>Google Gemini — AI-powered invoice extraction</li>
              <li>Vercel / Render — infrastructure hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Data Deletion</h2>
            <p>
              When a user deletes their account, BillForgeAI permanently deletes all
              invoices, clients, analytics data, and personal information within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Security Measures</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Encrypted database storage (MongoDB Atlas)</li>
              <li>Secure HTTPS/TLS communication</li>
              <li>JWT access control</li>
              <li>Rate limiting & brute-force protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Breach Notification</h2>
            <p>
              In case of a security breach affecting personal data,
              BillForgeAI will inform users within 72 hours as required by GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Contact</h2>
            <p>Email: support@billforgeai.com</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DataProcessingAgreement;

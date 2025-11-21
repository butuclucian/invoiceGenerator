import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-10"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-400 mb-10">
          Last updated: {new Date().toISOString().split("T")[0]}
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold">1. Who We Are</h2>
            <p>
              BillForgeAI is operated by an independent developer based in Romania.
              For privacy inquiries:{" "}
              <a href="mailto:support@billforgeai.com" className="text-[#80FFF9]">
                support@billforgeai.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Data We Collect</h2>
            <p>We collect the following categories of data:</p>

            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Client details & invoice content</li>
              <li>Uploaded documents used for AI extraction</li>
              <li>Subscription & payment information</li>
              <li>Usage analytics (only with cookie consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Why We Process Your Data (Legal Basis)</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Art. 6(1)(b) GDPR — account creation, invoicing</li>
              <li>Art. 6(1)(a) GDPR — analytics cookies</li>
              <li>Art. 6(1)(f) GDPR — app security & fraud prevention</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. AI Processing (Gemini)</h2>
            <p>
              When you request AI invoice extraction or generation, the text or file is
              temporarily sent to Google Gemini for inference. Neither BillForgeAI
              nor Google stores these files long-term or uses them to train AI models.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Subprocessors</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Google Gemini — AI processing</li>
              <li>Stripe — payments</li>
              <li>MongoDB Atlas — database hosting</li>
              <li>Vercel/Render — app hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Your GDPR Rights</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Access your data</li>
              <li>Request deletion (right to be forgotten)</li>
              <li>Export data</li>
              <li>Rectify inaccurate information</li>
              <li>Withdraw cookie consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Data Retention</h2>
            <p>
              Your data remains stored until you delete your account. When deleted, all
              invoices, client lists, and subscriptions are permanently erased.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Contact</h2>
            <p>Email: support@billforgeai.com</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;

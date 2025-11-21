import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-10"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-400 mb-10">
          Last updated: {new Date().toISOString().split("T")[0]}
        </p>

        {/* Content */}
        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. About BillForgeAI</h2>
            <p>
              BillForgeAI is an AI-assisted invoicing platform operated by an independent
              developer located in Romania. By using this service, you agree to abide by
              these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Use of Service</h2>
            <p>
              You may use BillForgeAI only for lawful purposes and in compliance with all
              applicable regulations. You are responsible for the accuracy of any invoice,
              client data, or financial information uploaded or generated through the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. AI-Generated Content Disclaimer
            </h2>
            <p>
              BillForgeAI uses Google Gemini to assist with invoice extraction and
              generation. AI may produce inaccurate or incomplete information. You agree to
              verify all AI-generated output before using it for accounting, tax reporting,
              or client communication.
            </p>
            <p className="mt-2">
              BillForgeAI is not liable for damages arising from incorrect AI-generated
              content, including calculation errors, missing fields, or misinterpretation of
              uploaded documents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. User Responsibilities</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Ensure all invoice data is correct before sending it to clients.</li>
              <li>Ensure that uploaded documents do not violate intellectual property rights.</li>
              <li>Maintain the confidentiality of your account credentials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Subscriptions & Payments</h2>
            <p>
              Paid plans (Pro, Enterprise) are managed through Stripe. All billing,
              cancellations, and refunds follow Stripe’s policies. Subscription fees are
              non-refundable unless required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. Data & Privacy</h2>
            <p>
              BillForgeAI processes personal data according to the{" "}
              <Link to="/privacy" className="text-[#80FFF9] hover:underline">
                Privacy Policy
              </Link>.  
              AI submissions are processed temporarily for inference and are not stored permanently or used to train models.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">7. Limitation of Liability</h2>
            <p>
              The service is provided “as is.” BillForgeAI is not responsible for financial
              losses, penalties, tax issues, or damages resulting from:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>incorrect AI-generated content,</li>
              <li>user-input errors,</li>
              <li>third-party errors (Stripe, Gemini, MongoDB Atlas),</li>
              <li>service interruptions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">8. Termination</h2>
            <p>
              You may close your account at any time. The platform reserves the right to
              terminate accounts for abuse, fraud, or illegal use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">9. Contact Information</h2>
            <p>
              Email: <a href="mailto:support@billforgeai.com" className="text-[#80FFF9]">support@billforgeai.com</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;

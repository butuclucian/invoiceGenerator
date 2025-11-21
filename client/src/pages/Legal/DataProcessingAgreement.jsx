import React from "react";
import PageTemplate from "./PageTemplate";

const DataProcessingAgreement = () => {
  return (
    <PageTemplate
      title="Data Processing Agreement"
      subtitle="GDPR-compliant agreement outlining how BillForgeAI processes customer data."
    >
      <p className="mb-6">
        This Data Processing Agreement (“DPA”) forms part of the Terms of Service
        between BillForgeAI and the Customer.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">1. Definitions</h3>
      <p>
        “Personal Data”, “Processing”, “Controller”, and “Processor” follow GDPR Article 4.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">2. Roles</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>Customer is the Data Controller.</li>
        <li>BillForgeAI is the Data Processor.</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">3. Processor Obligations</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>Process only under documented instructions</li>
        <li>Maintain confidentiality</li>
        <li>Implement strong security measures</li>
        <li>Assist with data subject requests</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">4. Sub-processors</h3>
      <p>
        BillForgeAI uses secure, reputable providers: Stripe, Google Cloud, MongoDB.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">5. Data Transfers</h3>
      <p>
        All data transfers comply with GDPR using SCCs or equivalent safeguards.
      </p>
    </PageTemplate>
  );
};

export default DataProcessingAgreement;

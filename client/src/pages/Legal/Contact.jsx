import React from "react";
import PageTemplate from "./PageTemplate";

const Contact = () => {
  return (
    <PageTemplate
      title="Contact Us"
      subtitle="We're here to help! Reach out anytime."
    >
      <div className="space-y-6">
        <p>Email: <span className="text-[#80FFF9]">support@billforgeai.com</span></p>
        <p>Business inquiries: <span className="text-[#CB52D4]">business@billforgeai.com</span></p>
        <p>Twitter: @BillForgeAI</p>
        <p>We typically respond within 24 hours.</p>
      </div>
    </PageTemplate>
  );
};

export default Contact;

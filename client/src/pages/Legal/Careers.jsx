import React from "react";
import PageTemplate from "./PageTemplate";

const Careers = () => {
  return (
    <PageTemplate
      title="Careers"
      subtitle="Join our mission to redefine invoicing through AI innovation."
    >
      <p className="mb-6">
        We’re building the future of billing automation. If you're passionate about
        AI, modern web technologies, or business tools, we'd love to hear from you.
      </p>

      <p>Send your CV to: <span className="text-[#80FFF9]">careers@billforgeai.com</span></p>
    </PageTemplate>
  );
};

export default Careers;

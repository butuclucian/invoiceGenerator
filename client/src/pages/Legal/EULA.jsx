import React from "react";
import PageTemplate from "./PageTemplate";

const EULA = () => {
  return (
    <PageTemplate
      title="End User License Agreement"
      subtitle="Read the licensing terms for using BillForgeAI."
    >
      <p className="mb-6">
        This EULA governs your access to and use of BillForgeAI as a licensed user.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">License Grant</h3>
      <p>
        BillForgeAI grants you a non-exclusive, non-transferable license to use
        the platform.
      </p>

      <h3 className="text-white font-semibold mt-10 mb-2">Restrictions</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>No reverse engineering</li>
        <li>No resale or redistribution</li>
        <li>No malicious use or scraping</li>
      </ul>

      <h3 className="text-white font-semibold mt-10 mb-2">Termination</h3>
      <p>
        Violations may result in account suspension or termination.
      </p>
    </PageTemplate>
  );
};

export default EULA;

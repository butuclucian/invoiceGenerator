import React from "react";
import PageTemplate from "./PageTemplate";

const About = () => {
  return (
    <PageTemplate
      title="About Us"
      subtitle="Learn more about the story behind BillForgeAI and our mission."
    >
      <p>
        BillForgeAI was created with one mission: to simplify invoicing for
        freelancers, entrepreneurs, and modern digital businesses.  
      </p>

      <p className="mt-6">
        Our platform uses advanced AI to automate the entire billing workflow —
        from invoice creation to data extraction, analytics, reminders, and more.
      </p>

      <p className="mt-6">
        We believe in clean design, automation, and reducing friction for
        professionals who value their time. BillForgeAI is built to scale with
        your business.
      </p>
    </PageTemplate>
  );
};

export default About;

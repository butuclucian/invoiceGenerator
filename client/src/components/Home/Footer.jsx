import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0" />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="invoicelogo.png"
                alt="BillForge Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold tracking-wide">
                BillForge<span className="text-[#80FFF9]">AI</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Automate your invoicing process with Gemini AI. Generate, analyze,
              and send invoices — faster than ever.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Product
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  AI Invoice Parser
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Resources
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#80FFF9] transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/60">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-medium">BillForgeAI</span>. All
            rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="hover:text-[#80FFF9] transition"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="hover:text-[#80FFF9] transition"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="#"
              className="hover:text-[#80FFF9] transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="#"
              className="hover:text-[#80FFF9] transition"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

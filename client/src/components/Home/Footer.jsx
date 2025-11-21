import React from "react";
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-[#0e0e0e] border-t border-white/10 overflow-hidden pt-20">
      
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[650px] h-[250px] bg-gradient-to-r from-[#80FFF9]/20 via-[#CB52D4]/20 to-[#80FFF9]/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* BRAND AREA */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="invoicelogo.png" className="w-10 h-10 rounded-full" />
              <span className="text-2xl font-semibold">
                BillForge<span className="text-[#80FFF9]">AI</span>
              </span>
            </div>

            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              AI-powered invoicing for freelancers & small businesses.  
              Generate invoices, extract data, track payments — in seconds.
            </p>

            <div className="flex gap-4 mt-5">
              <a href="#" className="hover:text-[#80FFF9] transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-[#80FFF9] transition">
                <Github size={18} />
              </a>
              <a href="#" className="hover:text-[#80FFF9] transition">
                <Linkedin size={18} />
              </a>
              <a href="mailto:support@billforgeai.com" className="hover:text-[#80FFF9] transition">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="footer-title">Product</h3>
            <ul className="footer-list">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/dashboard/ai-generator">AI Generator</Link></li>
              <li><Link to="/dashboard/invoices">Invoices</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="footer-title">Company</h3>
            <ul className="footer-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="footer-title">Legal</h3>
            <ul className="footer-list">
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/dpa">Data Processing Agreement</Link></li>
              <li><Link to="/eula">EULA</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} BillForgeAI. All rights reserved.</p>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-[#80FFF9]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#80FFF9]">Terms</Link>
            <Link to="/cookies" className="hover:text-[#80FFF9]">Cookies</Link>
          </div>
        </div>
      </div>

      {/* FOOTER STYLE */}
      <style>{`
        .footer-title {
          color: white;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .footer-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-list a {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          transition: 0.2s;
        }
        .footer-list a:hover {
          color: #80FFF9;
        }
      `}</style>
    </footer>
  );
};

export default Footer;

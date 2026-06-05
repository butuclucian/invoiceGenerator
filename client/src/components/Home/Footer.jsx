import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1E1E1E] text-[#E8E8E8] rounded-t-[3rem] md:rounded-t-[4rem] mt-20 px-6 md:px-12 pt-24 pb-8 overflow-hidden relative selection:bg-[#E8E8E8] selection:text-[#1E1E1E]">
      <div className="max-w-[1700px] mx-auto flex flex-col">
        
        {/* Secțiunea Superioară: CTA Uriaș și Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-white/20 pb-16">
          <div className="max-w-3xl">
            <h2 className="text-6xl md:text-[90px] font-black tracking-tighter leading-[0.9] mb-6 uppercase">
              Ready to <br />
              <span className="text-transparent [-webkit-text-stroke:2px_#E8E8E8]">get paid?</span>
            </h2>
            <p className="text-gray-400 text-xl md:text-2xl font-light">
              Join thousands of freelancers who get paid <span className="font-bold text-white">2x faster</span>.
            </p>
          </div>
          
          <div className="w-full lg:w-auto flex flex-col gap-4">
            <Link 
              to="/register"
              className="inline-flex items-center justify-center bg-[#E8E8E8] text-[#1E1E1E] px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-purple-400 hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(232,232,232,0.1)] hover:scale-105"
            >
              Start Creating Free →
            </Link>
          </div>
        </div>

        {/* Secțiunea de Mijloc: Link-uri de Navigare */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Coloana 1 */}
          <div className="flex flex-col gap-5">
            <span className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs mb-2">// Product</span>
            {['Features', 'Pricing', 'Templates', 'API'].map((item) => (
              <Link key={item} to="#" className="text-lg font-bold text-gray-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group">
                {item} <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-400">→</span>
              </Link>
            ))}
          </div>

          {/* Coloana 2 */}
          <div className="flex flex-col gap-5">
            <span className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs mb-2">// Company</span>
            {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
              <Link key={item} to="#" className="text-lg font-bold text-gray-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group">
                {item} <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-400">→</span>
              </Link>
            ))}
          </div>

          {/* Coloana 3 */}
          <div className="flex flex-col gap-5">
            <span className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs mb-2">// Socials</span>
            {['Twitter (X)', 'LinkedIn', 'Instagram'].map((item) => (
              <a key={item} href="#" className="text-lg font-bold text-gray-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group">
                {item} <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-400">↗</span>
              </a>
            ))}
          </div>

          {/* Coloana 4: Adresa (Pentru a păstra tema de design din meniul fullscreen) */}
          <div className="flex flex-col gap-5">
            <span className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs mb-2">// Offices</span>
            <div className="text-gray-300">
              <h4 className="font-bold text-white text-lg">Timisoara.</h4>
              <p className="text-sm font-light mt-1 text-gray-400">Str. Macilor 51,<br />Timisoara, RO</p>
            </div>
            <div className="text-gray-300 mt-2">
              <h4 className="font-bold text-white text-lg">Iasi.</h4>
              <p className="text-sm font-light mt-1 text-gray-400">Str. Mihai Viteazul 71,<br />Iasi, RO</p>
            </div>
          </div>
        </div>

        {/* Secțiunea Text Masiv */}
        <div className="w-full flex items-center justify-center py-4 border-t border-white/10 mt-4 overflow-hidden relative">
          {/* Folosim vw (viewport width) pentru ca textul să se scaleze perfect pe lățimea ecranului */}
          <h1 className="text-[14vw] font-black tracking-tighter leading-none text-[#E8E8E8] select-none text-center w-full">
            invoiceGenAi<span className="text-purple-500">.</span>
          </h1>
        </div>

        {/* Secțiunea de Bază: Legal & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 text-gray-500 text-xs font-bold tracking-widest uppercase">
          <p>© {currentYear} INVOICEGENAI. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../../components/Home/Navbar2";
import Footer from "../../components/Home/Footer";

const Cookies = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] } 
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E8E8] pt-32 overflow-hidden selection:bg-[#1E1E1E] selection:text-[#E8E8E8]">
      <Navbar2 />
      <div className="max-w-9xl mx-auto px-4 md:px-8 pb-24 md:pb-16">
        
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1.0] }} onClick={() => navigate(-1)} className="flex items-center gap-3 text-[#1E1E1E] font-bold uppercase tracking-widest text-sm mb-12 group hover:text-purple-600 transition-colors">
          <div className="w-12 h-12 rounded-full border-2 border-[#1E1E1E] flex items-center justify-center group-hover:bg-[#1E1E1E] group-hover:text-[#E8E8E8] group-hover:border-[#1E1E1E] transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform duration-300">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          Go Back
        </motion.button>

        <div className="flex flex-col mb-16 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }} className="w-full font-bold text-[80px] md:text-[140px] lg:text-[180px] tracking-[-9%] leading-[0.8] uppercase select-none">
            <span className="text-transparent [-webkit-text-stroke:2px_#1E1E1E]">COOKIE </span>
            <span className="text-[#1E1E1E]">POLICY.</span>
          </motion.div>
          
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-[#1E1E1E] text-xl md:text-3xl pl-2 md:pl-34 mt-8 font-handwriting max-w-3xl">
            How and why we use cookies on invoiceGenAi.
          </motion.p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div variants={itemVariants} className="md:col-span-8 bg-[#1E1E1E] text-[#E8E8E8] rounded-[2.5rem] p-10 md:p-16 flex flex-col relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="relative z-10">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 block">
                // 01 Types of Cookies
              </span>
              
              <p className="text-xl md:text-2xl font-bold tracking-tight leading-snug mb-10 text-white">
                Cookies help us enhance your experience and improve platform performance. We strictly use what is necessary.
              </p>

              <div className="flex flex-col gap-6">
                {[
                  { title: "Essential Cookies", desc: "Required to operate the dashboard, authentication, and security." },
                  { title: "Analytics Cookies", desc: "Optional. Used for product improvement (only if accepted)." },
                  { title: "Preference Cookies", desc: "Save your UI settings like theme choices or dashboard filters." }
                ].map((cookie, idx) => (
                  <div key={idx} className="flex items-start gap-5 bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-4 h-4 mt-1 bg-purple-500 rounded-sm shrink-0"></div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-wider mb-1">{cookie.title}</h4>
                      <p className="text-gray-400 text-sm md:text-base font-medium">{cookie.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 inline-block bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-2xl">
                <p className="text-red-400 font-bold text-sm tracking-wide">
                  * invoiceGenAi DOES NOT use advertising cookies or third-party marketing trackers.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="md:col-span-4 flex flex-col gap-6">
            
            <motion.div variants={itemVariants} className="flex-1 border-2 border-[#1E1E1E] bg-transparent text-[#1E1E1E] rounded-[2.5rem] p-10 flex flex-col justify-between group hover:bg-[#1E1E1E] hover:text-[#E8E8E8] transition-colors duration-500">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.2em] mb-6 block transition-colors duration-500">
                  // 02 Third-Party
                </span>
                <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center mb-8 group-hover:rotate-45 transition-transform duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight mb-4">External Services</h3>
                <p className="text-base font-medium leading-relaxed opacity-80">
                  Stripe, Google Analytics, and Gemini APIs may set strict cookies to support payment and AI functionality.
                </p>
              </div>
            </motion.div>


            <motion.div variants={itemVariants} className="flex-1 bg-purple-500 text-[#1E1E1E] rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 border-4 border-[#1E1E1E]/20 rounded-full"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.2em] mb-6 block text-[#1E1E1E]/70">
                  // 03 Control
                </span>
                
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-4">Your Preferences</h3>
                  <p className="text-base font-bold leading-relaxed opacity-90">
                    You may disable cookies in your browser settings at any time, but please note that some dashboard features may break.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Cookies;
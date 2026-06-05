import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Home/Footer";
import Navbar2 from "../../components/Home/Navbar2";

const Contact = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
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
      <div className="max-w-[1700px] mx-auto">
        
        {/* Buton de Back */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1.0] }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-[#1E1E1E] font-bold uppercase tracking-widest text-sm mb-12 group hover:text-purple-600 transition-colors"
        >
          <div className="w-12 h-12 rounded-full border-2 border-[#1E1E1E] flex items-center justify-center group-hover:bg-[#1E1E1E] group-hover:text-[#E8E8E8] group-hover:border-[#1E1E1E] transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform duration-300">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          Go Back
        </motion.button>

        {/* Header Section: Tipografie Masivă */}
        <div className="flex flex-col mb-16 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }}
            className="w-full font-bold text-[80px] md:text-[150px] lg:text-[200px] tracking-[-9%] leading-[0.8] uppercase select-none"
          >
            <span className="text-transparent [-webkit-text-stroke:2px_#1E1E1E]">GET IN </span>
            <br className="hidden md:block" />
            <span className="text-[#1E1E1E]">TOUCH.</span>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[#1E1E1E] text-xl md:text-3xl pl-2 md:pl-34 mt-8 font-handwriting max-w-3xl"
          >
            We're here to help! Reach out anytime.
          </motion.p>
        </div>

        {/* Grid Asimetric pentru Conținut */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Card 1: Technical Support (Dark & Massive) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-7 bg-[#1E1E1E] text-[#E8E8E8] rounded-[2.5rem] p-10 md:p-16 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#80FFF9]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 transition-all duration-700 group-hover:bg-[#80FFF9]/20"></div>
            
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 block">
                // 01 Technical Support
              </span>
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#80FFF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>

            <div>
              <p className="text-lg md:text-xl text-gray-400 mb-2 font-light">Need help with your account?</p>
              <a href="mailto:support@invoicegenai.com" className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter hover:text-[#80FFF9] transition-colors inline-block relative border-b-4 border-transparent hover:border-[#80FFF9] pb-1">
                support@invoicegenai.com
              </a>
            </div>
          </motion.div>

          {/* Card 2: Business Inquiries (Outlined Minimalist) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-5 border-2 border-[#1E1E1E] bg-transparent text-[#1E1E1E] rounded-[2.5rem] p-10 md:p-16 flex flex-col justify-between group hover:bg-[#1E1E1E] hover:text-[#E8E8E8] transition-colors duration-500 relative overflow-hidden"
          >
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] mb-6 block text-[#1E1E1E] group-hover:text-gray-400 transition-colors duration-500">
                // 02 Business
              </span>
              <div className="w-16 h-16 rounded-full border-2 border-[#1E1E1E] group-hover:border-white/20 flex items-center justify-center mb-8 group-hover:-rotate-12 transition-all duration-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
            </div>

            <div>
              <p className="text-lg text-gray-600 group-hover:text-gray-400 mb-2 font-light transition-colors">Partnerships & Sales</p>
              <a href="mailto:business@invoicegenai.com" className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter hover:text-[#CB52D4] transition-colors">
                business@invoicegenai.com
              </a>
            </div>
          </motion.div>

          {/* Card 3: Socials & Response Time (Accent Color) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-12 bg-purple-500 text-[#1E1E1E] rounded-[2.5rem] p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 shadow-xl relative overflow-hidden"
          >
            {/* Grafică abstractă de fundal */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -right-10 -top-20 w-80 h-80 border-2 border-[#1E1E1E]/10 rounded-full border-dashed"
            />

            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-sm font-bold uppercase tracking-[0.2em] mb-2 block text-[#1E1E1E]/70">
                // 03 Stay Connected
              </span>
              <a href="https://twitter.com/invoiceGenAi" target="_blank" rel="noreferrer" className="text-4xl md:text-6xl font-black tracking-tighter leading-none hover:text-white transition-colors flex items-center gap-4 group">
                @invoiceGenAi
                <span className="w-10 h-10 md:w-14 md:h-14 bg-[#1E1E1E] text-white rounded-full flex items-center justify-center text-xl md:text-2xl group-hover:bg-white group-hover:text-[#1E1E1E] group-hover:rotate-45 transition-all">
                  ↗
                </span>
              </a>
            </div>

            <div className="relative z-10 bg-[#1E1E1E] text-white px-8 py-6 rounded-3xl flex items-center gap-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></div>
              <p className="font-bold tracking-tight text-lg">We typically respond within 24 hours.</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Home/Footer";
import Navbar2 from "../../components/Home/Navbar2";

const About = () => {
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
      
      {/* Container global aliniat cu restul paginilor */}
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 pb-24 md:pb-32">
        
        {/* Buton de Back */}
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1.0] }} onClick={() => navigate(-1)} className="flex items-center gap-3 text-[#1E1E1E] font-bold uppercase tracking-widest text-sm mb-12 group hover:text-purple-600 transition-colors">
          <div className="w-12 h-12 rounded-full border-2 border-[#1E1E1E] flex items-center justify-center group-hover:bg-[#1E1E1E] group-hover:text-[#E8E8E8] group-hover:border-[#1E1E1E] transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform duration-300">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          Go Back
        </motion.button>

        {/* Header Section: Tipografie Masivă */}
        <div className="flex flex-col mb-16 relative">
          <motion.div  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }} className="w-full font-bold text-[80px] md:text-[140px] lg:text-[180px] tracking-[-9%] leading-[0.8] uppercase select-none">
            <span className="text-transparent [-webkit-text-stroke:2px_#1E1E1E]">OUR </span>
            <span className="text-[#1E1E1E]">STORY.</span>
          </motion.div>
          
          <motion.p  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-[#1E1E1E] text-xl md:text-2xl md:pl-34 mt-8 font-handwriting max-w-3xl">
            Learn more about the mission behind invoiceGenAi.
          </motion.p>
        </div>

        {/* Grid Asimetric pentru Conținut */}
        <motion.div  variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Card 1: The Mission (Dark & Brutalist) */}
          <motion.div  variants={itemVariants} className="md:col-span-8 bg-[#1E1E1E] text-white rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group border-4 border-[#1E1E1E] shadow-[12px_12px_0px_0px_rgba(30,30,30,0.2)]">
            {/* Element grafic decorativ ascuns parțial */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <span className="text-sm font-black uppercase tracking-[0.2em] text-[#E8E8E8]/50 mb-12 block">
              // 01 The Mission
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] relative z-10">
              We were built to <span className="text-transparent [-webkit-text-stroke:2px_#E8E8E8]">simplify invoicing</span> for the modern digital business.
            </h2>
          </motion.div>

          {/* Card 2: The Tech (Outlined Minimalist) */}
          <motion.div  variants={itemVariants} className="md:col-span-4 border-4 border-[#1E1E1E] bg-transparent text-[#1E1E1E] hover:bg-white transition-colors duration-500 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between group">
            <span className="text-sm font-black uppercase tracking-[0.2em] mb-8 block text-[#1E1E1E]">
              // 02 The Tech
            </span>
            <div>
              <div className="w-16 h-16 rounded-full border-4 border-[#1E1E1E] flex items-center justify-center mb-8 group-hover:rotate-45 group-hover:bg-[#1E1E1E] group-hover:text-[#E8E8E8] transition-all duration-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <p className="text-lg md:text-xl font-bold tracking-tight leading-relaxed">
                Our platform uses local AI (Ollama) to automate the entire billing workflow — from creation to data extraction, keeping your data secure.
              </p>
            </div>
          </motion.div>

          {/* Card 3: The Philosophy (Accent Color, Massive Shadow) */}
          <motion.div  variants={itemVariants} className="md:col-span-12 bg-purple-500 text-[#1E1E1E] border-4 border-[#1E1E1E] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 shadow-[16px_16px_0px_0px_rgba(30,30,30,1)] relative overflow-hidden mt-4">
            
            {/* Grafică abstractă de fundal */}
            <motion.div  animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -right-20 -bottom-40 w-96 h-96 border-8 border-[#1E1E1E]/20 rounded-full pointer-events-none"/>
            <motion.div  animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -right-10 -bottom-20 w-64 h-64 border-8 border-[#1E1E1E]/20 rounded-full pointer-events-none"/>

            <div className="relative z-10 max-w-5xl">
              <span className="inline-block px-6 py-3 bg-[#1E1E1E] text-white text-xs font-black uppercase tracking-[0.2em] rounded-full mb-8 border-2 border-[#1E1E1E]">
                // 03 The Philosophy
              </span>
              <p className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] uppercase">
                We believe in clean design, <span className="text-white [-webkit-text-stroke:2px_#1E1E1E]">absolute automation</span>, and zero friction for professionals who value their time.
              </p>
            </div>
            
          </motion.div>

        </motion.div>
        
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
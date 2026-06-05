import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar2 from '../components/Home/Navbar2';
import { Link } from 'react-router-dom';
import Footer from '../components/Home/Footer';

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Minimalist", "Corporate", "Creative", "Freelancer"];

  const templatesData = [
    { id: 1, title: "Classic Professional", category: "Corporate", tag: "Popular", isDark: false },
    { id: 2, title: "Clean Minimal", category: "Minimalist", tag: "Free", isDark: false },
    { id: 3, title: "Midnight Creator", category: "Creative", tag: "Pro", isDark: true },
    { id: 4, title: "Agency Standard", category: "Corporate", tag: "Free", isDark: false },
    { id: 5, title: "Freelance Simple", category: "Freelancer", tag: "New", isDark: false },
    { id: 6, title: "Dark Tech", category: "Creative", tag: "Pro", isDark: true },
  ];

  const filteredTemplates = activeCategory === "All" 
    ? templatesData 
    : templatesData.filter(template => template.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#E8E8E8] pt-32 overflow-hidden selection:bg-[#1E1E1E] selection:text-[#E8E8E8]">
      <Navbar2 />
      {/* Container Principal */}
      <div className="max-w-[1700px] mx-auto">

        {/* Buton de Back */}
        <motion.div  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link  to="/" className="group inline-flex items-center gap-3 text-[#1E1E1E] font-bold hover:text-gray-500 transition-colors mb-12">
            <div className="w-10 h-10 rounded-full border-2 border-[#1E1E1E] group-hover:border-gray-500 flex items-center justify-center transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </div>
            Back to Home
          </Link>
        </motion.div>
        
        {/* Secțiunea de Header */}
        <div className="flex flex-col mb-16 relative">
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }} className="w-full font-bold text-[80px] md:text-[150px] lg:text-[200px] tracking-[-9%] leading-[0.8] uppercase select-none">
            <span className="text-transparent [-webkit-text-stroke:2px_#1E1E1E]" >Invoice</span>
            <br className="hidden md:block" />
            <span className="text-[#1E1E1E]">Templates</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-[#1E1E1E] text-xl md:text-3xl pl-2 md:pl-34 mt-8 font-handwriting max-w-3xl">
            Choose from our curated collection of professional invoice templates designed to get you paid faster.
          </motion.p>

        </div>

        {/* Secțiunea de Filtrare (Pills) */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {categories.map((category) => (
            <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-[#1E1E1E] text-white shadow-lg scale-105" 
                  : "bg-transparent border-2 border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#1E1E1E]/10"}`}>
              {category}
            </button>
          ))}
        </div>

        {/* Grid-ul cu Template-uri */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredTemplates.map((template) => (
              <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} key={template.id} className="bg-[#1E1E1E] rounded-[2.5rem] p-6 flex flex-col group relative overflow-hidden">

                <div className={`w-full aspect-[1/1.2] rounded-3xl mb-6 relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] 
                ${ template.isDark ? "bg-[#0A0A0A] border border-white/10" : "bg-white"}`}>
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      template.tag === 'Pro' ? "bg-purple-500 text-white" : 
                      template.tag === 'Free' ? "bg-green-400 text-black" : 
                      "bg-[#E8E8E8] text-[#1E1E1E]"}`}>
                      {template.tag}
                    </span>
                  </div>

                  {/* Wireframe Factură (Design Abstract) */}
                  <div className="absolute inset-6 flex flex-col gap-4 opacity-50">
                    {/* Header Factura */}
                    <div className="flex justify-between items-end border-b border-gray-400/20 pb-4">
                      <div className={`w-12 h-12 rounded-full ${template.isDark ? "bg-white/20" : "bg-gray-200"}`}></div>
                      <div className={`w-24 h-4 rounded-md ${template.isDark ? "bg-white/20" : "bg-gray-200"}`}></div>
                    </div>
                    {/* Content Factura */}
                    <div className="flex flex-col gap-2 mt-4">
                      <div className={`w-3/4 h-3 rounded-md ${template.isDark ? "bg-white/10" : "bg-gray-100"}`}></div>
                      <div className={`w-1/2 h-3 rounded-md ${template.isDark ? "bg-white/10" : "bg-gray-100"}`}></div>
                    </div>
                    {/* Tabel Factura */}
                    <div className="mt-auto flex flex-col gap-2">
                      <div className={`w-full h-8 rounded-md ${template.isDark ? "bg-white/5" : "bg-gray-50"}`}></div>
                      <div className={`w-full h-8 rounded-md ${template.isDark ? "bg-white/5" : "bg-gray-50"}`}></div>
                    </div>
                  </div>

                  {/* Overlay la Hover */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <button className="bg-white text-[#1E1E1E] px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                      Use Template
                    </button>
                  </div>
                  
                </div>

                {/* Partea de Jos a Cardului: Detalii */}
                <div className="px-2">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                    {template.category}
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-white text-2xl font-bold tracking-tight">
                      {template.title}
                    </h3>
                    {/* Săgeată subtilă animată */}
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#1E1E1E] transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
      <Footer />
    </div>
  );
};

export default Templates;
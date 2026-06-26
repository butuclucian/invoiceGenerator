import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar2 from '../components/Home/Navbar';

const HowItWorks = () => {

  const stepsData = [
    {
      id: "01",
      title: "Pick the perfect template.",
      description: "Start by browsing our premium collection of invoice templates. Whether you are a minimalist freelancer or a corporate agency, you'll find a design that perfectly matches your brand identity.",
      isDark: true,
      badge: "Step 1",
    },
    {
      id: "02",
      title: "Customize & add details.",
      description: "Input your business information, client details, and line items. Our smart system automatically calculates taxes, discounts, and totals so you don't have to touch a calculator.",
      isDark: false,
      badge: "Step 2",
    },
    {
      id: "03",
      title: "Send and get paid faster.",
      description: "Download a pixel-perfect PDF or share a secure payment link directly with your client. Receive payments in multiple currencies straight into your account.",
      isDark: true,
      badge: "Step 3",
    }
  ];

  return (
    <div className="min-h-screen bg-[#E8E8E8] font-sans selection:bg-[#1E1E1E] selection:text-white">
      <Navbar />

      <div className="max-w-[1700px] mx-auto px-4 pb-24">
        
        {/* Buton de Back */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="group inline-flex items-center gap-3 text-[#1E1E1E] font-bold hover:text-gray-500 transition-colors mb-12"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#1E1E1E] group-hover:border-gray-500 flex items-center justify-center transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </div>
            Back to Home
          </Link>
        </motion.div>

        {/* Header-ul Paginii */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-24 relative">
          <div className="absolute top-10 right-20 w-72 h-72 bg-[#1E1E1E]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

          <div className="relative z-10 w-full lg:w-2/3">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-[100px] xl:text-[150px] font-bold tracking-[-5%] md:tracking-[-9%] leading-[0.85] text-transparent [-webkit-text-stroke:1.5px_#1E1E1E] md:[-webkit-text-stroke:2px_#1E1E1E] uppercase"
            >
              HOW IT <br className="hidden md:block" />
              <span className="text-[#1E1E1E] [-webkit-text-stroke:0px]">WORKS.</span>
            </motion.h1>
          </div>

          <div className="relative z-10 w-full lg:w-1/3 lg:pb-6">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-gray-600 text-lg md:text-xl font-light leading-relaxed border-l-2 border-[#1E1E1E] pl-6"
            >
              Generating professional invoices doesn't have to be a chore. See how our AI-driven platform streamlines your billing process in three simple steps.
            </motion.p>
          </div>
        </div>

        {/* Container-ul pentru pași */}
        <div className="flex flex-col gap-12 md:gap-20">
          {stepsData.map((step, index) => {
            const isEven = index % 2 !== 0;

            return (
              <motion.div 
                key={step.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center`}
              >
                {/* Partea de Conținut (Text) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border-2 border-[#1E1E1E] text-[#1E1E1E]">
                      {step.badge}
                    </span>
                    <div className="h-0.5 w-12 bg-[#1E1E1E]/20"></div>
                  </div>
                  
                  <div className="relative">
                    {/* Număr Uriaș decorativ în spate */}
                    <span className="absolute -top-16 -left-8 text-[150px] font-black text-[#1E1E1E]/5 select-none z-0">
                      {step.id}
                    </span>
                    <h2 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E1E1E] tracking-tight mb-6 leading-tight">
                      {step.title}
                    </h2>
                    <p className="relative z-10 text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Partea Vizuală (Cardul abstract) */}
                <div className="w-full lg:w-1/2">
                  <div className={`w-full aspect-4/3 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden shadow-2xl ${
                    step.isDark ? "bg-[#1E1E1E]" : "bg-transparent border-2 border-[#1E1E1E]"
                  }`}>
                    
                    {/* Animație subtilă în interiorul cardului pentru a-i da viață */}
                    <motion.div 
                      whileHover={{ scale: 1.02, rotate: isEven ? -2 : 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-full h-full relative"
                    >
                      {/* Generăm abstractizări CSS diferite în funcție de pas */}
                      
                      {step.id === "01" && (
                        <div className="absolute inset-0 flex items-center justify-center gap-4">
                           <div className="w-1/3 h-3/4 bg-white/10 rounded-2xl border border-white/20"></div>
                           <div className="w-1/3 h-full bg-white/20 rounded-2xl border border-white/30 shadow-2xl transform -translate-y-4"></div>
                           <div className="w-1/3 h-3/4 bg-white/10 rounded-2xl border border-white/20"></div>
                        </div>
                      )}

                      {step.id === "02" && (
                        <div className="absolute inset-4 flex flex-col gap-4">
                           <div className="w-full h-12 bg-[#1E1E1E]/5 border border-[#1E1E1E]/10 rounded-xl"></div>
                           <div className="w-3/4 h-12 bg-[#1E1E1E]/5 border border-[#1E1E1E]/10 rounded-xl"></div>
                           <div className="w-full h-32 bg-[#1E1E1E]/5 border border-[#1E1E1E]/10 rounded-xl mt-auto relative">
                             <div className="absolute bottom-4 right-4 w-1/3 h-8 bg-[#1E1E1E]/10 rounded-lg"></div>
                           </div>
                        </div>
                      )}

                      {step.id === "03" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 animate-pulse">
                             <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                 <path d="M20 6L9 17l-5-5"/>
                               </svg>
                             </div>
                           </div>
                        </div>
                      )}

                    </motion.div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Call To Action Final */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
          }}
          className="mt-32 bg-[#1E1E1E] rounded-[3rem] p-12 md:p-20 text-center flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 relative z-10">
            Ready to streamline your workflow?
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mb-10 relative z-10">
            Join thousands of freelancers and businesses who are already getting paid faster and looking professional.
          </p>
          <Link 
            to="/register"
            className="bg-white text-[#1E1E1E] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#E8E8E8] hover:scale-105 transition-all shadow-xl relative z-10"
          >
            Start Creating Invoices
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default HowItWorks;
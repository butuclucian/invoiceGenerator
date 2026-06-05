import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  // Variante pentru animații
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
    <div className="min-h-screen bg-[#E8E8E8] pt-32 pb-24 px-4 overflow-hidden selection:bg-[#1E1E1E] selection:text-[#E8E8E8]">
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16 relative">
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }}
              className="w-full font-bold text-[70px] md:text-[130px] lg:text-[160px] tracking-[-9%] leading-[0.8] uppercase select-none"
            >
              <span className="text-transparent [-webkit-text-stroke:2px_#1E1E1E]">TERMS OF </span>
              <br className="hidden md:block" />
              <span className="text-[#1E1E1E]">SERVICE.</span>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-10 bg-white border-2 border-[#1E1E1E] text-[#1E1E1E] px-8 py-4 rounded-full flex flex-col md:items-end shadow-[8px_8px_0px_#1E1E1E]"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Last Updated</span>
            <span className="text-xl font-black">{new Date().toISOString().split("T")[0]}</span>
          </motion.div>
        </div>

        {/* Grid Asimetric pentru Conținut */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          
          {/* 1. About & 2. Use of Service (Outlined) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-7 border-2 border-[#1E1E1E] bg-transparent text-[#1E1E1E] rounded-[2.5rem] p-10 flex flex-col gap-10"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-gray-500">
                // 01 About invoiceGenAi
              </span>
              <p className="font-bold text-lg md:text-xl leading-relaxed">
                invoiceGenAi is an AI-assisted invoicing platform operated by an independent
                developer located in Romania. By using this service, you agree to abide by
                these Terms of Service.
              </p>
            </div>
            
            <div className="w-full h-px bg-[#1E1E1E]/20"></div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-gray-500">
                // 02 Use of Service
              </span>
              <p className="font-medium text-gray-700 leading-relaxed">
                You may use invoiceGenAi only for lawful purposes and in compliance with all
                applicable regulations. You are responsible for the accuracy of any invoice,
                client data, or financial information uploaded or generated through the app.
              </p>
            </div>
          </motion.div>

          {/* 3. AI Disclaimer (Dark) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-5 bg-[#1E1E1E] text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6 block relative z-10">
                // 03 AI Content Disclaimer
              </span>
              <h3 className="text-2xl font-black tracking-tight mb-4 relative z-10">
                AI may produce inaccurate information.
              </h3>
              <p className="text-gray-300 font-medium leading-relaxed relative z-10 mb-6">
                invoiceGenAi uses Google Gemini to assist with invoice extraction and generation. 
                You agree to verify all AI-generated output before using it for accounting, tax reporting, or client communication.
              </p>
            </div>

            <div className="relative z-10 bg-white/10 p-5 rounded-2xl border border-white/20">
              <p className="text-sm font-bold text-gray-200">
                invoiceGenAi is not liable for damages arising from incorrect AI-generated content, calculation errors, or misinterpretation of uploaded documents.
              </p>
            </div>
          </motion.div>

          {/* 4. User Responsibilities (White Solid) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-6 bg-white border border-[#1E1E1E]/10 text-[#1E1E1E] rounded-[2.5rem] p-10 shadow-lg"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-gray-400">
              // 04 User Responsibilities
            </span>
            <h3 className="text-2xl font-black tracking-tight mb-6">You are required to:</h3>
            <ul className="space-y-4">
              {[
                "Ensure all invoice data is correct before sending it to clients.",
                "Ensure that uploaded documents do not violate intellectual property rights.",
                "Maintain the confidentiality of your account credentials."
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="font-bold text-sm md:text-base">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 5. Subscriptions (Accent Purple) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-6 bg-purple-500 text-[#1E1E1E] rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden"
          >
             <div className="absolute -left-10 -bottom-10 w-40 h-40 border-4 border-[#1E1E1E]/10 rounded-full"></div>
            
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-[#1E1E1E]/70 relative z-10">
              // 05 Subscriptions & Payments
            </span>
            <h3 className="text-3xl font-black tracking-tight mb-4 relative z-10">Stripe Billing</h3>
            <p className="text-lg font-bold leading-relaxed relative z-10">
              Paid plans are managed through Stripe. All billing, cancellations, and refunds follow Stripe’s policies. Subscription fees are non-refundable unless required by law.
            </p>
          </motion.div>

          {/* 6. Data & Privacy (Outlined) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-5 border-2 border-[#1E1E1E] bg-transparent text-[#1E1E1E] rounded-[2.5rem] p-10 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block">
                // 06 Data & Privacy
              </span>
              <p className="font-medium leading-relaxed mb-6">
                invoiceGenAi processes personal data according to our privacy guidelines. AI submissions are processed temporarily for inference and are not stored permanently or used to train models.
              </p>
            </div>
            <Link to="/privacy" className="inline-flex items-center justify-center w-full bg-[#1E1E1E] text-white py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-purple-600 transition-colors">
              Read Privacy Policy
            </Link>
          </motion.div>

          {/* 7. Limitation of Liability (Dark) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-7 bg-[#1E1E1E] text-white rounded-[2.5rem] p-10 flex flex-col justify-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-gray-400">
              // 07 Limitation of Liability
            </span>
            <h3 className="text-2xl font-black tracking-tighter mb-4">
              The service is provided “as is.”
            </h3>
            <p className="text-gray-400 font-medium leading-relaxed mb-6">
              invoiceGenAi is not responsible for financial losses, penalties, tax issues, or damages resulting from:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Incorrect AI-generated content",
                "User-input errors",
                "Third-party errors (Stripe, Gemini, MongoDB)",
                "Service interruptions"
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 8. Termination & 9. Contact (Combined Full Width) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-12 bg-white border-2 border-[#1E1E1E] rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 md:gap-0 justify-between items-start md:items-center shadow-[8px_8px_0px_#1E1E1E]"
          >
            <div className="md:w-1/2 md:pr-10 md:border-r-2 border-[#1E1E1E]/20">
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-gray-400">
                // 08 Termination
              </span>
              <p className="font-bold text-lg">
                You may close your account at any time. The platform reserves the right to terminate accounts for abuse, fraud, or illegal use.
              </p>
            </div>
            
            <div className="md:w-1/2 md:pl-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-gray-400">
                // 09 Contact
              </span>
              <p className="font-medium text-gray-600 mb-2">Legal inquiries & support:</p>
              <a href="mailto:support@invoicegenai.com" className="text-2xl md:text-3xl font-black tracking-tight text-[#1E1E1E] border-b-4 border-transparent hover:border-purple-500 transition-colors">
                support@invoicegenai.com
              </a>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../../components/Home/Navbar2";
import Footer from "../../components/Home/Footer";

const Privacy = () => {
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

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16 relative">
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }} className="w-full font-bold text-[70px] md:text-[130px] lg:text-[160px] tracking-[-9%] leading-[0.8] uppercase select-none"   >
              <span className="text-transparent [-webkit-text-stroke:2px_#1E1E1E]">PRIVACY </span>
              <br className="hidden md:block" />
              <span className="text-[#1E1E1E]">POLICY.</span>
            </motion.div>
          </div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="relative z-10 bg-[#1E1E1E] text-white px-8 py-4 rounded-full flex flex-col md:items-end" >
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Last Updated</span>
            <span className="text-xl font-bold">{new Date().toISOString().split("T")[0]}</span>
          </motion.div>
        </div>

        <motion.div variants={containerVariants}initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <motion.div variants={itemVariants} className="md:col-span-4 border-2 border-[#1E1E1E] bg-transparent text-[#1E1E1E] rounded-[2.5rem] p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-[#1E1E1E]">
                // 01 Who We Are
              </span>
              <h3 className="text-2xl font-black tracking-tight mb-4">Operator</h3>
              <p className="font-medium leading-relaxed opacity-90">
                invoiceGenAi is operated by an independent developer based in Romania.
              </p>
            </div>
            <div className="mt-8">
              <span className="text-xs font-bold uppercase tracking-widest block mb-2 opacity-60">Privacy Inquiries:</span>
              <a href="mailto:support@invoicegenai.com" className="text-lg font-black tracking-tight border-b-2 border-[#1E1E1E] hover:text-purple-600 hover:border-purple-600 transition-colors">
                support@invoicegenai.com
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-8 bg-[#1E1E1E] text-[#E8E8E8] rounded-[2.5rem] p-10 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 block relative z-10">
              // 02 Data We Collect
            </span>
            <h3 className="text-3xl font-black tracking-tighter mb-8 relative z-10">
              Categories of data we process:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {[
                "Account info (name, email, password)",
                "Client details & invoice content",
                "Uploaded documents used for AI",
                "Subscription & payment information",
                "Usage analytics (with cookie consent)"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#80FFF9]"></div>
                  <span className="font-medium text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-6 bg-white border border-[#1E1E1E]/10 text-[#1E1E1E] rounded-[2.5rem] p-10 md:p-12 shadow-lg">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-gray-400">
              // 03 Legal Basis
            </span>
            <h3 className="text-2xl font-black tracking-tight mb-6">Why we process your data</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="font-black text-purple-600 min-w-[120px]">Art. 6(1)(b)</span>
                <span className="font-medium text-sm">Account creation, invoicing & core services.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-black text-purple-600 min-w-[120px]">Art. 6(1)(a)</span>
                <span className="font-medium text-sm">Analytics cookies (only via explicit consent).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-black text-purple-600 min-w-[120px]">Art. 6(1)(f)</span>
                <span className="font-medium text-sm">App security & fraud prevention.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-6 bg-[#1E1E1E] text-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-gray-400">
              // 04 GDPR Rights
            </span>
            <h3 className="text-2xl font-black tracking-tight mb-6">Your privacy rights</h3>
            <div className="flex flex-wrap gap-3">
              {["Access Data", "Request Deletion", "Export Data", "Rectify Info", "Withdraw Consent"].map((right, idx) => (
                <span key={idx} className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-bold">
                  {right}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-12 bg-purple-500 text-[#1E1E1E] rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-start justify-between gap-10 shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 border-4 border-[#1E1E1E]/20 rounded-full"></div>
            
            <div className="relative z-10 md:w-1/3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-[#1E1E1E]/70">
                // 05 AI Processing
              </span>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                Google Gemini
              </h3>
            </div>
            
            <div className="relative z-10 md:w-2/3 bg-white/20 backdrop-blur-sm p-8 rounded-3xl border border-[#1E1E1E]/10">
              <p className="text-lg md:text-xl font-bold leading-relaxed">
                When you request AI invoice extraction or generation, the text or file is temporarily sent to Google Gemini for inference. 
                <br /><br />
                <span className="bg-[#1E1E1E] text-white px-2 py-1 rounded-md">Neither invoiceGenAi nor Google stores these files long-term or uses them to train AI models.</span>
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-5 border-2 border-[#1E1E1E] bg-transparent text-[#1E1E1E] rounded-[2.5rem] p-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block">
              // 06 Subprocessors
            </span>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#1E1E1E]/20 pb-3">
                <span className="font-bold">Google Gemini</span> <span className="text-sm opacity-70">AI processing</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#1E1E1E]/20 pb-3">
                <span className="font-bold">Stripe</span> <span className="text-sm opacity-70">Payments</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#1E1E1E]/20 pb-3">
                <span className="font-bold">MongoDB Atlas</span> <span className="text-sm opacity-70">Database</span>
              </div>
              <div className="flex justify-between items-center pb-3">
                <span className="font-bold">Vercel / Render</span> <span className="text-sm opacity-70">Hosting</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-7 bg-[#1E1E1E] text-white rounded-[2.5rem] p-10 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-gray-400">
              // 07 Data Retention
            </span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">
              Your data remains stored until you delete your account.
            </h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              When deleted, all invoices, client lists, and active subscriptions are permanently and irreversibly erased from our databases.
            </p>
          </motion.div>

        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar2 from '../components/Home/Navbar2';
import Footer from '../components/Home/Footer';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      description: "Perfect for freelancers just starting out.",
      monthlyPrice: "0",
      annualPrice: "0",
      features: [
        "Up to 3 invoices per month",
        "2 Basic templates",
        "Export to PDF",
        "Standard email support"
      ],
      isPopular: false,
      darkTheme: false,
      btnText: "Get Started Free"
    },
    {
      name: "Pro",
      description: "Everything you need to run your business smoothly.",
      monthlyPrice: "12",
      annualPrice: "9",
      features: [
        "Unlimited invoices",
        "All premium templates",
        "AI-powered generation",
        "Multi-currency support",
        "Priority 24/7 support"
      ],
      isPopular: true,
      darkTheme: true,
      btnText: "Start 14-Day Trial"
    },
    {
      name: "Agency",
      description: "For teams and agencies managing multiple clients.",
      monthlyPrice: "39",
      annualPrice: "29",
      features: [
        "Everything in Pro",
        "Up to 5 team members",
        "Custom branding & white-label",
        "Client portal access",
        "Dedicated account manager"
      ],
      isPopular: false,
      darkTheme: false,
      btnText: "Contact Sales",
      linkTo: "/contact"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1.0] } 
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E8E8] pt-32 overflow-hidden selection:bg-[#1E1E1E] selection:text-[#E8E8E8]">
      <Navbar2 />

      <div className="max-w-9xl mx-auto px-4 md:px-8 pb-24 md:pb-16">
  
        <motion.button  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1.0] }} onClick={() => navigate(-1)} className="flex items-center gap-3 text-[#1E1E1E] font-bold uppercase tracking-widest text-sm mb-12 group hover:text-purple-600 transition-colors">
          <div className="w-12 h-12 rounded-full border-2 border-[#1E1E1E] flex items-center justify-center group-hover:bg-[#1E1E1E] group-hover:text-[#E8E8E8] group-hover:border-[#1E1E1E] transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform duration-300">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          Go Back
        </motion.button>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 relative">
          
          <div className="relative z-10 w-full lg:w-2/3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }} className="font-bold text-[80px] md:text-[140px] lg:text-[180px] tracking-[-9%] leading-[0.8] uppercase select-none">
              <span className="text-transparent [-webkit-text-stroke:2px_#1E1E1E]">FAIR </span>
              <br className="hidden md:block" />
              <span className="text-[#1E1E1E]">PRICING.</span>
            </motion.div>
          </div>

          <div className="relative z-10 w-full lg:w-1/3 flex flex-col items-start lg:items-end text-left lg:text-right">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-[#1E1E1E] text-xl font-handwriting mb-8">
              No hidden fees, no surprises.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center bg-transparent border-2 border-[#1E1E1E] p-1.5 rounded-full">
              <button onClick={() => setIsAnnual(false)} className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${!isAnnual ? "bg-[#1E1E1E] text-[#E8E8E8]" : "text-[#1E1E1E] hover:bg-[#1E1E1E]/10"}`}>
                Monthly
              </button>
              <button onClick={() => setIsAnnual(true)} className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${isAnnual ? "bg-[#1E1E1E] text-[#E8E8E8]" : "text-[#1E1E1E] hover:bg-[#1E1E1E]/10"}`}>
                Annually
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isAnnual ? "border-[#E8E8E8]/30 bg-white/10" : "border-[#1E1E1E] bg-[#1E1E1E]/10"}`}>
                  -25%
                </span>
              </button>
            </motion.div>
          </div>
        </div>

        <motion.div  variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants} className={`relative flex flex-col p-8 lg:p-12 rounded-[2.5rem] transition-all duration-500 group 
              ${plan.darkTheme 
                  ? "bg-[#1E1E1E] text-white shadow-2xl md:scale-105 z-10 lg:py-16" 
                  : "bg-transparent border-2 border-[#1E1E1E] text-[#1E1E1E] hover:bg-white"}`}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-purple-500 text-[#1E1E1E] text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full border-2 border-[#1E1E1E] shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-10">
                <span className={`text-xs font-bold uppercase tracking-widest mb-4 block ${plan.darkTheme ? "text-gray-400" : "text-gray-500"}`}>
                  // {plan.name}
                </span>
                <p className={`text-sm md:text-base font-medium h-12 leading-relaxed ${plan.darkTheme ? "text-gray-300" : "text-gray-600"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-10 flex items-baseline gap-2">
                <span className="text-6xl lg:text-7xl font-black tracking-tighter">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className={`text-sm font-bold uppercase tracking-widest ${plan.darkTheme ? "text-gray-400" : "text-gray-500"}`}>
                  / month
                </span>
              </div>
              
              <div className="h-6 -mt-8 mb-8">
                {isAnnual && plan.annualPrice !== "0" && (
                  <p className={`text-xs font-bold tracking-wider uppercase ${plan.darkTheme ? "text-purple-400" : "text-purple-600"}`}>
                    Billed ${plan.annualPrice * 12} yearly
                  </p>
                )}
              </div>

              <ul className="flex flex-col gap-5 mb-12 grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-4">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      plan.darkTheme ? "border-purple-400 text-purple-400" : "border-[#1E1E1E] text-[#1E1E1E]"
                    }`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                    <span className={`text-sm md:text-base font-bold ${plan.darkTheme ? "text-gray-200" : "text-[#1E1E1E]"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.linkTo ? (
                <Link to={plan.linkTo} className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-widest text-center transition-all duration-300 ${
                  plan.darkTheme 
                    ? "bg-[#E8E8E8] text-[#1E1E1E] hover:bg-purple-400 hover:text-white" 
                    : "bg-[#1E1E1E] text-[#E8E8E8] hover:bg-purple-600 hover:text-white"
                }`}>
                  {plan.btnText}
                </Link>
              ) : (
                <Link to="/register" className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-widest text-center transition-all duration-300 ${
                  plan.darkTheme 
                    ? "bg-[#E8E8E8] text-[#1E1E1E] hover:bg-purple-400 hover:text-white" 
                    : "bg-[#1E1E1E] text-[#E8E8E8] hover:bg-purple-600 hover:text-white"
                }`}>
                  {plan.btnText}
                </Link>
              )}

            </motion.div>
          ))}
        </motion.div>

        <motion.div  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-24 md:mt-32 w-full bg-purple-500 rounded-[3rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl relative overflow-hidden">
          <div className="absolute -left-20 -top-20 w-64 h-64 border-4 border-[#1E1E1E]/20 rounded-full"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-[#1E1E1E] mb-4">
              Have a large team?
            </h3>
            <p className="text-[#1E1E1E]/80 text-lg md:text-xl font-bold">
              We offer custom enterprise plans with unlimited resources and white-glove onboarding.
            </p>
          </div>

          <Link to="/contact" className="relative z-10 shrink-0 bg-[#1E1E1E] text-[#E8E8E8] font-black uppercase tracking-widest text-sm px-10 py-5 rounded-full hover:bg-transparent hover:text-[#1E1E1E] border-2 border-[#1E1E1E] transition-all duration-300 flex items-center gap-3">
            Contact Sales
          </Link>
        </motion.div>

      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
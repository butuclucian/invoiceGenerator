import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Home/Footer';
import Navbar2 from '../components/Home/Navbar2';
import API from '../utils/api';

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    API.get("/users/me") 
      .then((res) => {
        setIsLoggedIn(true);
      })
      .catch((err) => {
        setIsLoggedIn(false);
        console.error(err.response?.data || err.message);
      });
  }, []);

  const text = [
    { value: "START CREATING YOUR ", transparent: false },
    { value: "INVOICE", transparent: true },
    { value: " NOW!", transparent: false },
  ];

  const subtext = "powered by local AI (Ollama 3.1)";

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.09 },
    },
  };

  const renderText = (str) =>
    str.split("").map((char, i) => (
      <motion.span key={i} variants={letter}>
        {char}
      </motion.span>
    ));

  const workflowData = [
    {
      title: "Inbox Sync",
      description: "Our system connects to your email and scans for billing requests every 30 seconds. Uninterrupted flow.",
    },
    {
      title: "AI Drafts",
      description: "Ollama 3.1 reads the context and auto-generates the invoice data locally, without sending info to the cloud.",
    },
    {
      title: "Send & Get Paid",
      description: "Review the AI draft, approve it with one click, and track your payments seamlessly.",
      linkText: "Explore features",
      linkUrl: "/features",
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1.0] } 
    }
  };

  return (
    <div className="bg-[#E8E8E8] min-h-screen selection:bg-[#1E1E1E] selection:text-[#E8E8E8] overflow-hidden">
      <Navbar2 />

      <div className="h-screen bg-[#E8E8E8] relative flex items-center justify-center p-2 overflow-hidden">
        <div className="w-full h-full bg-[#1E1E1E] rounded-[2.5rem] overflow-hidden relative flex flex-col justify-center">
          <div className="absolute top-8 right-8 md:right-20 flex items-center gap-4 z-50">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="text-[#E8E8E8] text-sm border-2 border-[#E8E8E8] px-6 py-2 rounded-full font-bold hover:bg-[#E8E8E8]/20 transition-colors tracking-widest hidden md:block"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="text-[#E8E8E8] text-sm border-2 border-[#E8E8E8] px-6 py-2 rounded-full font-bold hover:bg-[#E8E8E8]/20 transition-colors tracking-widest hidden md:block"
              >
                Get Started
              </Link>
            )}

            <img
              src={menuOpen ? "OpenMenu.png" : "menu.png"}
              alt="Menu"
              className="w-7 h-auto cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>

          {menuOpen && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-[#1E1E1E]/90 backdrop-blur-md z-40 flex flex-col h-screen"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 flex-1 border-0 text-white pt-20 md:pt-0">
                {["Dashboard", "Features", "Pricing", "Contact"].map(
                  (item, idx) => (
                    <Link
                      key={idx}
                      to={`/${item.toLowerCase()}`}
                      className="border border-[#E8E8E8] flex items-center justify-center text-5xl md:text-7xl font-bold cursor-pointer hover:bg-white/10 tracking-[-11%] text-[#E8E8E8] no-underline py-10 md:py-0"
                    >
                      {item}
                    </Link>
                  ),
                )}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center ml-4 md:ml-10 z-10">
            <div className="flex flex-col">
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="mt-15 w-full text-white font-bold text-[80px] md:text-[140px] lg:text-[180px] tracking-[-11%] leading-[0.8] [-webkit-text-stroke:2px_white]"
              >
                {text.map((part, i) => (
                  <span
                    key={i}
                    className={
                      part.transparent ? "text-transparent tracking-[-10%]" : ""
                    }
                  >
                    {renderText(part.value)}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="flex items-center gap-4 mt-8"
              >
                <h1 className="text-white text-xl md:text-2xl font-handwriting">
                  {subtext}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-8xl mx-auto pb-24 pt-20 md:pb-32 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-bold text-[60px] md:text-[100px] lg:text-[130px] tracking-[-8%] leading-[0.8] uppercase select-none mb-8"
            >
              <span className="text-[#1E1E1E]">LOCAL </span>
              <br className="hidden md:block" />
              <span className="text-transparent [-webkit-text-stroke:2px_#1E1E1E]">
                BRAIN.
              </span>
            </motion.div>
            <p className="text-[#1E1E1E] text-xl font-handwriting max-w-md mb-8">
              100% privacy. Zero cloud data leaks.
            </p>
            <p className="text-[#1E1E1E]/80 text-lg md:text-xl font-bold max-w-xl leading-relaxed mb-8">
              We completely ditched cloud APIs. Your invoice generation runs{" "}
              <span className="bg-[#1E1E1E] text-white px-2 py-1 rounded-md mx-1">
                Ollama 3.1
              </span>{" "}
              directly in your local environment. Your client data never leaves
              your system.
            </p>
          </div>

          <div className="flex-1 w-full relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white border-4 border-[#1E1E1E] rounded-[2.5rem] p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(30,30,30,1)] relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-8 pb-6 border-b-4 border-[#1E1E1E]">
                <div className="w-4 h-4 rounded-full border-2 border-[#1E1E1E] bg-[#E8E8E8]"></div>
                <div className="w-4 h-4 rounded-full border-2 border-[#1E1E1E] bg-[#E8E8E8]"></div>
                <div className="w-4 h-4 rounded-full border-2 border-[#1E1E1E] bg-[#E8E8E8]"></div>
                <span className="ml-auto text-xs font-black uppercase tracking-widest text-[#1E1E1E]">
                  Terminal
                </span>
              </div>

              <div className="font-mono text-sm md:text-base text-[#1E1E1E] space-y-4 font-bold">
                <p className="text-gray-500">{`> initializing ollama serve...`}</p>
                <p className="text-gray-500">{`> loading model 'llama3.1'...`}</p>
                <p className="text-purple-600 bg-purple-100 inline-block px-2">{`> model loaded locally. [OK]`}</p>
                <p className="mt-4">{`> extracting invoice data from context...`}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-8xl mx-auto pb-24 md:pb-32 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-purple-500 rounded-[3rem] p-8 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border-4 border-[#1E1E1E] shadow-[16px_16px_0px_0px_rgba(30,30,30,1)]"
        >
          <div className="absolute -left-20 -bottom-20 w-80 h-80 border-8 border-[#1E1E1E]/20 rounded-full pointer-events-none"></div>

          <div className="relative z-10 w-full md:w-1/2">
            <span className="inline-block px-6 py-3 bg-[#1E1E1E] text-white text-xs font-black uppercase tracking-[0.2em] rounded-full mb-8 border-2 border-[#1E1E1E]">
              // AUTOPILOT ENABLED
            </span>
            <h2 className="text-[50px] md:text-[80px] font-black uppercase leading-[0.9] text-[#1E1E1E] tracking-tighter mb-6">
              NEVER MISS <br />A BILL.
            </h2>
            <p className="text-[#1E1E1E] text-lg md:text-xl font-bold leading-relaxed max-w-lg">
              Our background worker connects to your inbox. Every{" "}
              <span className="bg-[#1E1E1E] text-white px-2 py-1 mx-1 rounded">
                30 seconds
              </span>
              , it scans for client emails, detects billing requests, and
              auto-drafts the invoice instantly.
            </p>
          </div>

          <div className="relative z-10 w-full md:w-1/3 flex justify-center">
            <div className="w-64 h-64 rounded-full border-8 border-[#1E1E1E] flex items-center justify-center relative bg-[#E8E8E8] shadow-inner">
              <div className="absolute inset-4 border-4 border-dashed border-[#1E1E1E]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="text-center z-10 bg-[#E8E8E8] px-4 py-2 rounded-xl border-2 border-[#1E1E1E]">
                <span className="text-6xl font-black text-[#1E1E1E] block tracking-tighter">
                  30s
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-[#1E1E1E]">
                  Sync
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-8xl mx-auto pb-24 md:pb-32 px-4 md:px-8">
        <div className="w-full mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-bold text-[60px] md:text-[100px] lg:text-[130px] tracking-[-8%] leading-[0.8] uppercase select-none mb-6"
          >
            <span className="text-[#1E1E1E]">ONE </span>
            <span className="text-transparent [-webkit-text-stroke:2px_#1E1E1E]">
              PLATFORM.
            </span>
          </motion.div>
          <p className="text-[#1E1E1E] text-xl font-handwriting max-w-md">
            Your entire billing workflow, automated and connected.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full relative z-10"
        >
          {workflowData.map((card, index) => {
            const isMiddle = index === 1;
            const isLast = index === 2;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex flex-col p-8 lg:p-12 rounded-[2.5rem] transition-all duration-500 group h-full border-4 border-[#1E1E1E]
                ${
                  isMiddle
                    ? "bg-transparent text-[#1E1E1E] hover:bg-white"
                    : isLast
                      ? "bg-purple-500 text-[#1E1E1E] hover:bg-purple-400"
                      : "bg-[#1E1E1E] text-white shadow-[12px_12px_0px_0px_rgba(30,30,30,0.2)] md:scale-105 z-10 lg:py-16"
                }`}
              >
                <div className="mb-10">
                  <span
                    className={`text-[80px] lg:text-[100px] font-black tracking-tighter leading-none block mb-4
                    ${
                      isMiddle || isLast
                        ? "text-transparent [-webkit-text-stroke:2px_#1E1E1E]"
                        : "text-transparent [-webkit-text-stroke:2px_#E8E8E8]"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-none mb-4 uppercase">
                    {card.title}
                  </h3>
                  <p
                    className={`text-sm md:text-base font-bold leading-relaxed ${isMiddle || isLast ? "text-[#1E1E1E]/80" : "text-gray-300"}`}
                  >
                    {card.description}
                  </p>
                </div>

                <div className="mt-auto">
                  {card.linkText ? (
                    <Link
                      to={card.linkUrl}
                      className={`w-full block py-5 rounded-full font-black text-sm uppercase tracking-widest text-center transition-all duration-300 border-2 border-[#1E1E1E]
                      ${
                        isLast
                          ? "bg-[#1E1E1E] text-[#E8E8E8] hover:bg-transparent hover:text-[#1E1E1E]"
                          : "bg-[#E8E8E8] text-[#1E1E1E] hover:bg-transparent"
                      }`}
                    >
                      {card.linkText}
                    </Link>
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 
                      ${isMiddle ? "border-[#1E1E1E] text-[#1E1E1E]" : "border-[#E8E8E8] text-[#E8E8E8]"}`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
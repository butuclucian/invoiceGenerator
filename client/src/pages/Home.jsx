import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Home/Navbar';
import ScrollDownPopup from '../components/ScrollDownPopup';
import Footer from '../components/Home/Footer';
import Navbar2 from '../components/Home/Navbar2';

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  const text = [
    { value: "START CREATING YOUR ", transparent: false },
    { value: "INVOICE", transparent: true },
    { value: " NOW!", transparent: false },
  ];

  const subtext = "with invoiceGenAi";

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

  const cardsData = [
    {
      title: "Pick your invoice",
      description:
        "Save time as an entrepreneur or small business owner, by creating smart branded invoice with our free invoice templates. Download, add your business information and the payment details, and you’re done.",
    },
    {
      title: "Save or share your invoice",
      description:
        "Save your invoice to your own records, and share it online or in hard copy with your client to acknowledge their payment.",
    },
    {
      title: "Receiving payments from abroad?",
      description:
        "The invoiceGenAi account is the perfect fit if you're receiving payments from abroad. Get bank account details in 10 different currencies, to get paid like a local from around the world.",
      linkText: "Find out more.",
      linkUrl: "/find-out-more",
    },
  ];

  const templatesData = [
    {
      title: "Classic Design",
      description: "Perfect for standard business billing."
    },
    {
      title: "Modern Design",
      description: "A sleek approach for freelancers."
    },
    {
      title: "Minimalist Design",
      description: "Clean and straight to the point."
    }
  ];

  
  const blogPosts = [
    {
      id: 1,
      tag: "Product Update",
      title: "Introducing Smart AI Invoicing: Get paid 2x faster",
      description: "Discover how our new machine learning algorithms predict the best time to send invoices to your clients.",
      image: "https://images.unsplash.com/photo-1664575602276-bc303c004a43?q=80&w=2070&auto=format&fit=crop", 
      isLarge: true,
      darkText: false,
    },
    {
      id: 2,
      tag: "Guide",
      title: "5 Tax Season Tips for Freelancers in 2026",
      description: "Don't let tax season overwhelm you. Here is your ultimate checklist.",
      image: "",
      isLarge: false,
      darkText: true,
      // Folosim același stil ca la cardul 2 din "How it works"
      bgColor: "border-2 border-[#1E1E1E] bg-transparent", 
    },
    {
      id: 3,
      tag: "Business",
      title: "How to handle late payments gracefully",
      description: "Templates and strategies to maintain client relationships while securing your cashflow.",
      image: "",
      isLarge: false,
      darkText: false,
      // Folosim același stil ca la cardul 1/3 din "How it works"
      bgColor: "bg-[#1E1E1E] shadow-xl", 
    }
  ];

  return (
    <div>
      <Navbar2 />

      {/* hero section */}
      <div className="h-screen bg-[#E8E8E8] relative flex items-center justify-center p-2 overflow-hidden">
        <div className="w-full h-full bg-[#1E1E1E] rounded-4xl overflow-hidden relative flex flex-col justify-center">
          {/* buttons */}
          <div className="absolute top-8 right-20 flex items-center gap-4 z-50">
            <Link to="/register" className="text-[#E8E8E8] text-sm border-2 border-[#E8E8E8] px-6 py-2 rounded-full font-bold hover:bg-[#E8E8E8]/20 transition-colors">
              Get Started
            </Link>
            <img src={menuOpen ? "OpenMenu.png" : "menu.png"} alt="Menu" className="w-7 h-auto cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}/>
          </div>

          {/* Fullscreen Overlay Menu */}
          {menuOpen && (
            <motion.div initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.5 }} className="fixed inset-0 bg-[#1E1E1E]/90 backdrop-blur-md z-40 flex flex-col h-screen">
              <div className="grid grid-cols-3 grid-rows-2 flex-1 border-0 text-white">
                {["About", "Templates", "Pricing", "Contact"].map(
                  (item, idx) => (
                    <Link key={idx} to={`/${item.toLowerCase()}`} className="border border-[#E8E8E8] flex items-center justify-center text-7xl font-bold cursor-pointer hover:bg-white/10 tracking-[-11%] text-[#E8E8E8] no-underline">
                      {item}
                    </Link>
                  ),
                )}
                <div className="text-[#E8E8E8] p-8 flex flex-col justify-center h-full max-w-xl mx-auto">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-[#E8E8E8] font-black mb-6">
                    // Our offices
                  </h2>

                  <div className="grid grid-cols-2 gap-8 text-left">
                    <div className="group cursor-pointer">
                      <h3 className="text-lg font-bold tracking-tight transition-colors group-hover:text-gray-400">
                        Timisoara.
                      </h3>
                      <p className="text-sm text-[#E8E8E8] mt-1 leading-relaxed">
                        Str. Macilor
                        <br />
                        51, Timisoara, RO
                      </p>
                    </div>

                    <div className="group cursor-pointer">
                      <h3 className="text-lg font-bold tracking-tight transition-colors group-hover:text-gray-400">
                        Iasi.
                      </h3>
                      <p className="text-sm text-[#E8E8E8] mt-1 leading-relaxed">
                        Str. Mihai Viteazul
                        <br />
                        71, Iasi, RO
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Hero Typography Content */}
          <div className="ml-2">
            <div className="ml-2">
              <motion.div variants={container} initial="hidden" animate="visible" className="mt-15 w-full max-w-4xl text-white ml-3 font-bold text-[120px] lg:text-[190px] tracking-[-11%] leading-[0.8] [-webkit-text-stroke:2px_white]">
                {text.map((part, i) => (
                  <span  key={i} className={part.transparent ? "text-transparent tracking-[-10%]" : ""}>
                    {renderText(part.value)}
                  </span>
                ))}
              </motion.div>

              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.8 }} className="text-white text-2xl pl-34 mt-4 font-handwriting">
                {subtext}
              </motion.h1>
            </div>
          </div>

        </div>
      </div>

      

      {/* how it works section */}
      <div className="mx-auto relative overflow-hidden select-none flex items-center justify-center py-20 pb-75 px-4 w-full">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-auto hidden md:block pointer-events-none z-0">
          <img
            src="/Chenar2.png"
            alt="Background"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 lg:w-125 h-auto hidden md:block pointer-events-none z-0">
          <img
            src="/Circles.png"
            alt="Background"
            className="w-full h-auto object-cover"
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-4 lg:gap-6 w-full max-w-[1700px] mx-auto relative z-10"
        >
          {/* div1 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] },
              },
            }}
            className="flex flex-col items-center text-center pt-4"
          >
            <div className="w-full aspect-video md:aspect-16/8 bg-[#1E1E1E] rounded-3xl p-6 flex flex-col justify-center relative shadow-xl">
              <h3 className="text-white text-lg md:text-xl font-bold tracking-tight mb-2">
                {cardsData[0].title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light line-clamp-3">
                {cardsData[0].description}
              </p>

              <motion.div
                variants={{
                  hidden: { scale: 0.9, opacity: 0, rotate: 0 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    rotate: -8,
                    transition: { delay: 0.4, duration: 0.5 },
                  },
                }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 md:left-32 md:translate-x-0 w-45 h-14 bg-[#1E1E1E] border border-[#E8E8E8] text-white py-2 px-4 rounded-xl text-xs tracking-wider flex items-center justify-between shadow-xl origin-center"
              >
                <span></span>
              </motion.div>
            </div>
          </motion.div>

          {/* div2 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] },
              },
            }}
            className="flex flex-col items-center text-center pt-4 relative"
          >
            <div className="w-full aspect-video md:aspect-16/8 border-2 border-[#1E1E1E] rounded-3xl p-6 flex flex-col justify-center relative bg-transparent">
              <h3 className="text-[#1E1E1E] text-lg md:text-xl font-bold tracking-tight mb-2">
                {cardsData[1].title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-light line-clamp-3">
                {cardsData[1].description}
              </p>

              <motion.div
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    transition: { delay: 0.5, type: "spring", stiffness: 150 },
                  },
                }}
                className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-[#1E1E1E] rounded-full flex items-center justify-center shadow-md origin-center"
              >
                <span></span>
              </motion.div>
            </div>
          </motion.div>

          {/* div3 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] },
              },
            }}
            className="flex flex-col items-center text-center pt-4 relative"
          >
            <div className="w-full aspect-video md:aspect-16/8 bg-[#1E1E1E] rounded-3xl p-6 flex flex-col justify-center relative shadow-xl">
              <motion.div
                variants={{
                  hidden: { y: -20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.6, duration: 0.4 },
                  },
                }}
                className="absolute -top-8 md:-top-10 right-1/2 translate-x-1/2 md:right-8 md:translate-x-0 w-10 h-16 md:w-12 md:h-20 bg-[#1E1E1E] border border-[#E8E8E8] rounded-xl flex items-center justify-center shadow-xl"
              >
                <span></span>
              </motion.div>

              <h3 className="text-white text-lg md:text-xl font-bold tracking-tight mb-2">
                {cardsData[2].title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light line-clamp-3 mb-1">
                {cardsData[2].description}
              </p>
              {cardsData[2].linkText && (
                <Link
                  to={cardsData[2].linkUrl}
                  className="text-xs text-purple-400 underline font-medium inline-block hover:text-purple-300 transition-colors"
                >
                  {cardsData[2].linkText}
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* templates section */}
      <div className="max-w-8xl mx-auto py-20 px-4 w-full">
        
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] tracking-tight text-center mb-10">
          Our Templates
        </h2>

        <div className="flex flex-col md:flex-row max-w-[1700px] mx-auto h-[600px] gap-4" onMouseLeave={() => setActiveCard(0)}>
          {templatesData.map((template, index) => (
            <div key={index} onMouseEnter={() => setActiveCard(index)}
              className={`transition-all duration-500 ease-in-out bg-[#1E1E1E] rounded-4xl cursor-pointer relative overflow-hidden shadow-lg ${
                activeCard === index ? "flex-3" : "flex-1"}`}>
              
              <div className={`absolute inset-0 p-8 flex flex-col justify-end transition-opacity duration-300 delay-150 ${
                  activeCard === index ? "opacity-100" : "opacity-0"}`}>
                <h3 className="text-white text-2xl font-bold whitespace-nowrap">
                  {template.title}
                </h3>
                <p className="text-gray-400 text-sm mt-2 whitespace-nowrap">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* blog section - ACUM ADAPTATĂ LA TEMA TA */}
      <div className="w-full max-w-[1700px] mx-auto px-4 py-24 mb-10">
        {/* Header-ul secțiunii - Folosim culorile #1E1E1E pentru consistență */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] tracking-tight">
              Latest Insights
            </h2>
            <p className="text-gray-600 mt-2 text-lg font-light">
              Resources and tips to grow your freelance business.
            </p>
          </div>
          <button className="text-[#1E1E1E] font-bold border-b-2 border-[#1E1E1E] pb-1 hover:opacity-70 transition-opacity">
            View all articles
          </button>
        </div>

        {/* Grid-ul Asimetric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-auto lg:h-[600px]">
          
          {/* Articolul Principal */}
          <motion.div 
            whileHover="hover"
            className="lg:col-span-8 relative rounded-3xl overflow-hidden cursor-pointer group h-[400px] lg:h-full flex flex-col justify-end p-8 md:p-12 bg-[#1E1E1E]"
          >
            <motion.div 
              variants={{ hover: { scale: 1.05 } }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${blogPosts[0].image})` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1E1E1E] via-[#1E1E1E]/40 to-transparent z-0" />
            
            <div className="relative z-10 w-full md:w-3/4">
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4 border border-[#E8E8E8]/30">
                {blogPosts[0].tag}
              </span>
              <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                {blogPosts[0].title}
              </h3>
              <p className="text-gray-300 text-sm md:text-base font-light hidden md:block mb-6">
                {blogPosts[0].description}
              </p>
              <div className="flex items-center gap-2 text-white font-medium">
                Read Article 
                <motion.span variants={{ hover: { x: 5 } }} transition={{ duration: 0.2 }}>
                  →
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Coloana din dreapta */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6 h-full">
            
            {/* Articol Secundar 1 - Sincronizat cu stilul transparent din "How it works" */}
            <motion.div 
              whileHover="hover"
              className={`flex-1 rounded-3xl p-8 flex flex-col justify-between cursor-pointer group ${blogPosts[1].bgColor}`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E1E1E] mb-4 block">
                  {blogPosts[1].tag}
                </span>
                <h3 className={`text-2xl font-bold tracking-tight mb-3 text-[#1E1E1E]`}>
                  {blogPosts[1].title}
                </h3>
                <p className="text-gray-600 font-light text-sm line-clamp-2">
                  {blogPosts[1].description}
                </p>
              </div>
              <div className={`flex items-center gap-2 font-medium mt-6 text-[#1E1E1E]`}>
                Read Article
                <motion.span variants={{ hover: { x: 5 } }} transition={{ duration: 0.2 }}>
                  →
                </motion.span>
              </div>
            </motion.div>

            {/* Articol Secundar 2 - Sincronizat cu stilul solid #1E1E1E */}
            <motion.div 
              whileHover="hover"
              className={`flex-1 rounded-3xl p-8 flex flex-col justify-between cursor-pointer group ${blogPosts[2].bgColor}`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 block">
                  {blogPosts[2].tag}
                </span>
                <h3 className={`text-2xl font-bold tracking-tight mb-3 text-white`}>
                  {blogPosts[2].title}
                </h3>
                <p className="text-gray-400 font-light text-sm line-clamp-2">
                  {blogPosts[2].description}
                </p>
              </div>
              <div className={`flex items-center gap-2 font-medium mt-6 text-white`}>
                Read Article
                <motion.span variants={{ hover: { x: 5 } }} transition={{ duration: 0.2 }}>
                  →
                </motion.span>
              </div>
            </motion.div>

          </div>
        </div>
        
      </div>

      <Footer />
    </div>
  );
};

export default Home;
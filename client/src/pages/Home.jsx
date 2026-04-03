import React from 'react'
import Footer from '../components/Home/Footer'
import {motion} from 'framer-motion'
import Navbar from '../components/Home/Navbar';
import ScrollDownPopup from '../components/ScrollDownPopup';
import { Menu } from "lucide-react";
import { useState } from 'react';

const Home = () => {

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

    const [menuOpen, setMenuOpen] = useState(false);
    const menuHeight = 700;


  return (
    <div className='min-h-screen flex items-center justify-center flex-col mr-5 ml-5'>

      <ScrollDownPopup />
      {/* hero section */}
      <Navbar />
      <div className='w-full mt-2 m-5 pb-9 bg-[#1E1E1E] rounded-4xl overflow-hidden relative'>

        <div className="absolute top-8 right-20 flex items-center gap-4 z-50">
          <button className="text-[#1E1E1E] text-sm bg-white px-6 py-2 rounded-full font-bold">
            Contact us
          </button>
          <img src={menuOpen ? "OpenMenu.png" : "menu.png"} alt="" className="w-7 h-auto cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
        </div>

        {menuOpen && (
          <motion.div initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.5 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col h-screen" >
            <div className="grid grid-cols-3 grid-rows-2 flex-1 border-0 text-white">
              {["About", "Templates", "Pricing", "Contact"].map((item, idx) => (
                <div key={idx} className="border border-white/30 flex items-center justify-center text-7xl font-bold cursor-pointer hover:bg-white/10 tracking-[-11%]" >
                  {item}
                </div>
              ))}
              <div className='text-center text-white p-8 space-y-2'>
                <h2 className="text-lg font-bold">Our offices</h2>
                <p>
                  <strong>Copenhagen</strong><br />
                  1 Carlsberg Gate<br />
                  1260, København, Denmark
                </p>
                <p>
                  <strong>Billund</strong><br />
                  24 Lego Allé<br />
                  7190, Billund, Denmark
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div animate={{ y: menuOpen ? 700 : 0 }} transition={{ duration: 0.5 }}>
          <img src="INV.png" alt="" className='absolute translate-x-190 translate-y-[-280px] rotate-330 opacity-45' />
          <img src="Ellipse.png" alt="" className='absolute translate-x-370' />
          <img src="INV.png" alt="" className='absolute translate-x-110 translate-y-[550px] rotate-130 opacity-45' />

          {/* main text */}
          <div className="ml-2">
            <motion.div variants={container} initial="hidden" animate="visible" className="mt-15 w-full max-w-4xl text-white ml-3 font-bold text-[120px] lg:text-[190px] tracking-[-11%] leading-[0.8] [-webkit-text-stroke:2px_white]">
              {text.map((part, i) => (
                <span key={i} className={part.transparent ? "text-transparent tracking-[-10%]" : ""}>
                  {renderText(part.value)}
                </span>
              ))}
            </motion.div>

            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.8 }} className="text-white text-2xl ml-34 mt-4 font-handwriting">
              {subtext}
            </motion.h1>
          </div>
        </motion.div>
      </div>

      {/* choose the template section */}
      <div className='w-full overflow-x-hidden overflow-y-hidden relative'>

        <motion.div initial={{ opacity: 0, filter: "blur(10px)", y: 20 }} whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }} className="text-center relative flex flex-col items-center justify-center min-h-[250px]">
          <motion.img src="/11.png" alt="" className="w-full" />

          <motion.h2 className="relative z-10 font-extrabold text-9xl text-black uppercase tracking-tighter -translate-y-20" >
            CHOOSE THE TEMPLATE
          </motion.h2>

          <motion.h3 className="relative -translate-y-15" >
            Start creating your professional invoices
          </motion.h3>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10 max-w-[1600px] mx-auto -translate-y-15">
          <img src="/template.jpg" alt="Template 1" className="w-400 h-auto rounded-lg shadow-md hover:scale-105 transition-transform hover:cursor-pointer" />
          <img src="/template.jpg" alt="Template 1" className="w-400 h-auto rounded-lg shadow-md hover:scale-105 transition-transform hover:cursor-pointer" />
          <img src="/template.jpg" alt="Template 1" className="w-400 h-auto rounded-lg shadow-md hover:scale-105 transition-transform hover:cursor-pointer" />
          <img src="/template.jpg" alt="Template 1" className="w-400 h-auto rounded-lg shadow-md hover:scale-105 transition-transform hover:cursor-pointer" />
          <img src="/template.jpg" alt="Template 1" className="w-400 h-auto rounded-lg shadow-md hover:scale-105 transition-transform hover:cursor-pointer" />
          <img src="/template.jpg" alt="Template 1" className="w-400 h-auto rounded-lg shadow-md hover:scale-105 transition-transform hover:cursor-pointer" />
        </div>

        <img src="/INVBLACK.png" alt="" className='absolute -translate-y-120 rotate-330 -translate-x-100 z-0' />

        <img src="/INVBLACK.png" alt="" className='absolute -translate-y-280 rotate-300 translate-x-350 z-0' />

        <div className="flex justify-center mb-20 -translate-y-10">
          <button className='bg-[#1E1E1E] text-white px-8 py-4 font-extrabold rounded-2xl'>
            SEE ALL INVOICE TEMPLATES
          </button>
        </div>

      </div>

      {/* how it works section */}
      <div className='w-full mt-2 m-5 min-h-screen bg-[#1E1E1E] rounded-4xl overflow-hidden relative'>
        
        <motion.div initial={{ opacity: 0, filter: "blur(10px)", y: 20 }} whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }} className="flex flex-col items-center justify-center text-center w-full overflow-hidden mt-10" >
          <motion.h1 className="text-[160px] text-white font-extrabold leading-none mt-2" >
            HOW IT WORKS
          </motion.h1>

          <motion.h2 className="text-white " >
            All explained in 3 steps!
          </motion.h2>

          <motion.h3 className="relative text-white translate-x-150 text-xl -translate-y-10 -rotate-10 font-handwriting" >
            by invoiceGenAi
          </motion.h3>
        </motion.div>

        <div className='overflow-hidden h-[1200px] z-10 relative'>
          {/* step 1 */}
          <div className='relative translate-x-10'>
            <div className='relative bg-[#D9D9D9]/40 w-150 h-130 rounded-3xl backdrop-blur-sm z-10 flex items-center justify-center shadow-2xl border border-white/20 translate-x-25 translate-y-4'>
              <h1 className='text-white font-light text-7xl text-right px-4 w-full max-w-[420px] ml-auto translate-x-3 translate-y-45'>
                CREATE AN ACCOUNT
              </h1>
            </div>
            <h1 className='text-white text-[220px] font-extrabold rotate-90 -translate-x-210 translate-y-90 z-0'>01</h1>
          </div>

          {/* step 2 */}
          <div className='relative translate-x-280 -translate-y-212'>
            <div className='relative bg-[#D9D9D9]/40 w-150 h-130 rounded-3xl backdrop-blur-sm z-10 flex items-center justify-center shadow-2xl border border-white/20 translate-x-25 translate-y-4'>
              <h1 className='text-white font-light text-7xl text-right px-4 w-full max-w-[420px] ml-auto translate-x-3 translate-y-45'>
                ADD YOUR CLIENTS
              </h1>
            </div>
            <h1 className='text-white text-[220px] font-extrabold rotate-90 -translate-x-210 translate-y-90 z-0'>02</h1>
          </div>

          {/* step 3 */}
          <div className='relative translate-x-145 -translate-y-280'>
            <div className='relative bg-[#D9D9D9]/40 w-150 h-130 rounded-3xl backdrop-blur-sm z-10 flex items-center justify-center shadow-2xl border border-white/20 translate-x-25 translate-y-4'>
              <h1 className='text-white font-light text-7xl text-right px-4 w-full max-w-[420px] ml-auto translate-x-3 translate-y-45'>
                GENERATE INVOICES
              </h1>
            </div>
            <h1 className='text-white text-[220px] font-extrabold rotate-90 -translate-x-210 translate-y-90 z-0'>03</h1>
          </div>
        </div>

        <img src="/INV.png" alt="" className='absolute translate-x-280 -translate-y-150 rotate-330 z-0 opacity-40'/>

        <img src="/INV.png" alt="" className='absolute -translate-x-70 -translate-y-380 rotate-330 z-0 opacity-40'/>
      
      </div>

      {/* pricing section */}
      <div className='w-full overflow-x-hidden overflow-y-hidden relative min-h-screen'>

        <motion.div initial={{ opacity: 0, filter: "blur(10px)", y: 20 }} whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }} className="text-center relative flex flex-col items-center justify-center min-h-[250px]" >
          <motion.img src="/PRICING.png" alt="" className="w-2xl" />

          <motion.h2 className="relative z-10 font-extrabold text-9xl text-black uppercase tracking-tighter -translate-y-20" >
            PRICING
          </motion.h2>

          <motion.h3 className="relative -translate-y-15" >
            Simple pricing on your needs
          </motion.h3>
        </motion.div>

        {/* pricing cards */}
        <h1 className="text-6xl font-bold text-black text-center pb-10">COMING SOON!</h1>
        <h1 className="text-6xl font-bold text-black text-center pb-10">COMING SOON!</h1>
        <h1 className="text-6xl font-bold text-black text-center pb-10">COMING SOON!</h1>
        <h1 className="text-6xl font-bold text-black text-center pb-10">COMING SOON!</h1>
        <h1 className="text-6xl font-bold text-black text-center pb-10">COMING SOON!</h1>
        
        <div>
          
          <div>

          </div>
          
          <div>

          </div>
          
          <div>

          </div>

        </div>

      </div>

      <Footer />
      <div className='text-center'>
        <p className='mb-3'>Designed and built with ❤️ by your friends at invoiceGenAi.</p>
      </div>
      

    </div>
  )
}

export default Home

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Home/Navbar';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Product", "Guides", "Business", "Technology"];

  const blogPosts = [
    {
      id: 1,
      title: "How AI is revolutionizing freelance billing in 2026",
      excerpt: "Discover the machine learning algorithms that are predicting the best times to send invoices and practically eliminating late payments.",
      category: "Technology",
      date: "Jun 12, 2026",
      readTime: "5 min read",
      isDark: true,
      featured: true,
    },
    {
      id: 2,
      title: "5 Tax Season Tips for Digital Nomads",
      excerpt: "Don't let tax season overwhelm you. Here is your ultimate checklist for cross-border income.",
      category: "Guides",
      date: "May 28, 2026",
      readTime: "8 min read",
      isDark: false,
    },
    {
      id: 3,
      title: "Handling late payments gracefully",
      excerpt: "Templates and communication strategies to maintain client relationships while securing your cashflow.",
      category: "Business",
      date: "May 15, 2026",
      readTime: "4 min read",
      isDark: true,
    },
    {
      id: 4,
      title: "invoiceGenAi 2.0: What's new?",
      excerpt: "We've completely redesigned our dashboard. Here is a deep dive into the new features.",
      category: "Product",
      date: "Apr 22, 2026",
      readTime: "3 min read",
      isDark: true,
    },
    {
      id: 5,
      title: "The psychology of pricing your services",
      excerpt: "Why charging more often leads to better clients and less stress. A complete breakdown of value-based pricing.",
      category: "Business",
      date: "Apr 10, 2026",
      readTime: "6 min read",
      isDark: false,
    }
  ];

  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-[#E8E8E8] font-sans selection:bg-[#1E1E1E] selection:text-white pb-24">
      <Navbar />

      <div className="max-w-[1700px] mx-auto px-4 pt-32">
        
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16 relative">
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

          <div className="relative z-10 w-full lg:w-2/3">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-[100px] xl:text-[150px] font-bold tracking-[-5%] md:tracking-[-9%] leading-[0.85] text-transparent [-webkit-text-stroke:1.5px_#1E1E1E] md:[-webkit-text-stroke:2px_#1E1E1E] uppercase"
            >
              LATEST <br className="hidden md:block" />
              <span className="text-[#1E1E1E] [-webkit-text-stroke:0px]">INSIGHTS.</span>
            </motion.h1>
          </div>

          <div className="relative z-10 w-full lg:w-1/3 lg:pb-6">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-gray-600 text-lg md:text-xl font-light leading-relaxed border-l-2 border-[#1E1E1E] pl-6 mb-8"
            >
              Thoughts, guides, and resources to help you scale your freelance business and master your cashflow.
            </motion.p>
          </div>
        </div>

        {/* Secțiunea de Filtrare */}
        <div className="flex flex-wrap items-center gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-[#1E1E1E] text-white shadow-xl scale-105" 
                  : "bg-white border border-transparent hover:border-[#1E1E1E]/20 text-[#1E1E1E] shadow-sm hover:shadow-md"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content Container cu AnimatePresence pentru filtrare lină */}
        <motion.div layout className="flex flex-col gap-8">
          <AnimatePresence mode='popLayout'>
            
            {/* Articolul Featured (Dacă există) */}
            {featuredPost && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                key={`featured-${featuredPost.id}`}
                className="w-full relative rounded-[3rem] overflow-hidden group cursor-pointer"
              >
                <div className={`flex flex-col lg:flex-row w-full ${featuredPost.isDark ? "bg-[#1E1E1E]" : "bg-white border-2 border-[#1E1E1E]"}`}>
                  
                  {/* Imagine Abstractă Featured */}
                  <div className="w-full lg:w-1/2 p-4 lg:p-8">
                    <div className="w-full h-[300px] lg:h-[450px] rounded-[2rem] bg-gradient-to-br from-gray-800 to-black relative overflow-hidden flex items-center justify-center">
                      <div className="absolute w-64 h-64 border border-white/20 rounded-full group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                      <div className="absolute w-48 h-48 border border-white/10 rounded-full group-hover:scale-125 transition-transform duration-700 ease-in-out delay-75"></div>
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center z-10">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12h4l3-9 5 18 3-9h5"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Info Featured */}
                  <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${featuredPost.isDark ? "bg-white/10 text-white" : "bg-[#1E1E1E]/10 text-[#1E1E1E]"}`}>
                        {featuredPost.category}
                      </span>
                      <span className={`text-sm font-medium ${featuredPost.isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {featuredPost.readTime}
                      </span>
                    </div>
                    
                    <h2 className={`text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight ${featuredPost.isDark ? "text-white" : "text-[#1E1E1E]"}`}>
                      {featuredPost.title}
                    </h2>
                    
                    <p className={`text-lg font-light mb-10 leading-relaxed ${featuredPost.isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${featuredPost.isDark ? "bg-white text-[#1E1E1E] group-hover:bg-gray-200" : "bg-[#1E1E1E] text-white group-hover:bg-black"}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                      <span className={`font-bold ${featuredPost.isDark ? "text-white" : "text-[#1E1E1E]"}`}>Read Full Article</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* Grid-ul pentru restul articolelor */}
            {regularPosts.length > 0 && (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    key={post.id}
                    className={`rounded-[2.5rem] p-6 lg:p-8 flex flex-col group cursor-pointer transition-transform hover:-translate-y-2 ${post.isDark ? "bg-[#1E1E1E] text-white" : "bg-transparent border-2 border-[#1E1E1E] text-[#1E1E1E]"}`}
                  >
                    {/* Cover Abstract (Mic) */}
                    <div className={`w-full h-48 lg:h-64 rounded-[1.5rem] mb-8 relative overflow-hidden flex items-center justify-center ${post.isDark ? "bg-[#0A0A0A]" : "bg-white border border-[#1E1E1E]/10"}`}>
                      {/* Generăm forme diferite randomizat / in funcție de ID */}
                      {post.id % 2 === 0 ? (
                        <div className="w-full h-full opacity-30 flex gap-2 rotate-12 scale-150">
                          <div className={`w-8 h-full ${post.isDark ? "bg-white" : "bg-[#1E1E1E]"} rounded-full`}></div>
                          <div className={`w-8 h-full ${post.isDark ? "bg-white" : "bg-[#1E1E1E]"} rounded-full`}></div>
                          <div className={`w-8 h-full ${post.isDark ? "bg-white" : "bg-[#1E1E1E]"} rounded-full`}></div>
                        </div>
                      ) : (
                        <div className={`w-32 h-32 rounded-full border-4 ${post.isDark ? "border-white/20" : "border-[#1E1E1E]/20"} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <div className={`w-16 h-16 rounded-full ${post.isDark ? "bg-white/10" : "bg-[#1E1E1E]/10"}`}></div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${post.isDark ? "bg-white/10 text-white" : "bg-[#1E1E1E]/10 text-[#1E1E1E]"}`}>
                        {post.category}
                      </span>
                      <span className={`text-xs font-medium ${post.isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {post.date}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight mb-3 leading-snug">
                      {post.title}
                    </h3>
                    
                    <p className={`text-sm font-light line-clamp-2 mb-8 ${post.isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex justify-between items-center border-t pt-4 border-current/10">
                      <span className="text-sm font-medium opacity-70">{post.readTime}</span>
                      <div className="w-8 h-8 rounded-full border border-current opacity-50 flex items-center justify-center group-hover:opacity-100 group-hover:bg-current transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={post.isDark ? "#1E1E1E" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Mesaj când nu există articole în categorie */}
            {filteredPosts.length === 0 && (
              <motion.div initial={{ opacity: 0 }}  animate={{ opacity: 1 }}  className="py-20 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1E1E1E] mb-2">No articles found</h3>
                <p className="text-gray-500">We couldn't find any articles in this category.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-24 bg-[#1E1E1E] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Never miss an update.</h2>
            <p className="text-gray-400 font-light text-lg">Get the latest freelance tips and product updates delivered straight to your inbox.</p>
          </div>
          
          <div className="relative z-10 w-full md:w-1/2">
            <div className="flex flex-col sm:flex-row gap-3">
              <input  type="email"  placeholder="Enter your email"  className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-full focus:outline-none focus:border-white transition-colors"/>
              <button className="bg-white text-[#1E1E1E] px-8 py-4 rounded-full font-bold whitespace-nowrap hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-3 ml-4">We care about your data in our privacy policy.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Blog;
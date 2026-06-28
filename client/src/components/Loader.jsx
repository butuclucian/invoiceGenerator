import React from "react";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e0e0e] z-50">
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-teal-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col items-center gap-6">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#80FFF9]/20 blur-xl rounded-full" />
          <Brain className="text-[#80FFF9] relative z-10" size={48} />
        </motion.div>

        <div className="flex flex-col items-center">
          <p className="text-gray-200 font-medium tracking-wider text-sm">
            Se procesează datele...
          </p>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [8, 16, 8] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 bg-linear-to-b from-teal-500 to-indigo-600 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
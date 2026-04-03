import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ScrollDownPopup = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2 flex flex-col items-center">
      <span className="text-white font-light">scroll down</span>
      <motion.svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }} >
        <ChevronDown />
      </motion.svg>
    </motion.div>
  );
};

export default ScrollDownPopup;
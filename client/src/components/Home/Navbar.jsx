import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 50);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 100 }} transition={{ duration: 0.4 }} className=" fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-4xl bg-[#1E1E1E]/60 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] ">
      <div className="flex items-center gap-10 text-white relative">

        <p className="font-bold">Home</p>
        <p className="font-bold">Templates</p>

        <motion.img src="/invoicelogo.png" alt="logo" className="w-16" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear",}}/>

        <p className="font-bold">How It Works</p>
        <p className="font-bold">Pricing</p>

      </div>
    </motion.div>
  );
};

export default Navbar;
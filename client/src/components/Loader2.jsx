import React from "react";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e0e0e] z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin text-[#80FFF9]" size={50} />
        <p className="text-gray-400 mt-4 text-sm tracking-wide">
          Loading page...
        </p>
      </div>
    </div>
  );
};

export default Loader;

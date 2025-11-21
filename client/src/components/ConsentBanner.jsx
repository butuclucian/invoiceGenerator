import React, { useState, useEffect } from "react";

const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const reject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] sm:w-[600px] bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-xl z-[999]">
      <h3 className="font-semibold text-white mb-2">Cookie Preferences</h3>
      <p className="text-sm text-gray-300">
        We use essential cookies to run BillForgeAI. We also use optional
        analytics cookies to improve your experience. You can accept or decline.
      </p>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={reject}
          className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/10 transition"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="px-4 py-2 text-sm bg-[#80FFF9] text-black rounded-lg hover:bg-[#80fff9]/80 transition"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;

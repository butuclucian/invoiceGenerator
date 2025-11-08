import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { LockKeyhole, Mail, LogIn, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post( `${import.meta.env.VITE_API_URL}/auth/login`, formData);
      localStorage.setItem("token", data.token);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#0e0e0e] to-[#1a1a1a] text-white relative overflow-hidden">
      {/* 🌀 Background Glow */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-[#80FFF9]/20 rounded-full blur-[200px]" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[200px]" />

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-[#80FFF9] transition"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      {/* 🧾 Login Card */}
      <div className="relative bg-[#111]/90 border border-[#1e1e1e] backdrop-blur-md p-10 rounded-2xl w-[90%] max-w-md shadow-lg shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-[#1a1a1a] border border-[#222] rounded-full">
              <LockKeyhole size={26} className="text-[#80FFF9]" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">
            Join <span className="text-[#80FFF9]">BillForge AI</span> and simplify your billing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-3 focus-within:border-[#80FFF9] transition">
              <Mail size={18} className="text-[#80FFF9]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-transparent p-2 text-white outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-3 focus-within:border-[#80FFF9] transition">
              <LockKeyhole size={18} className="text-[#80FFF9]" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent p-2 text-white outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 py-2.5 rounded-md font-medium hover:opacity-90 transition-all duration-300 shadow-md shadow-indigo-500/20"
          >
            {loading ? "Logging in..." : <> <LogIn size={18} /> Login </>}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-400">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-[#80FFF9] hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

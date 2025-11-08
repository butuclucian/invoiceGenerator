import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { UserPlus, Mail, LockKeyhole, LogIn, ArrowLeft } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:8000/api/auth/register", form);
      localStorage.setItem("token", data.token);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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

      {/* 🧾 Register Card */}
      <div className="relative bg-[#111]/90 border border-[#1e1e1e] backdrop-blur-md p-10 rounded-2xl w-[90%] max-w-md shadow-lg shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-[#1a1a1a] border border-[#222] rounded-full">
              <UserPlus size={26} className="text-[#80FFF9]" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white">Create Account</h1>
          <p className="text-gray-400 text-sm mt-1">
            Join <span className="text-[#80FFF9]">BillForge AI</span> and simplify your billing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">Full Name</label>
            <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-3 focus-within:border-[#80FFF9] transition">
              <UserPlus size={18} className="text-[#80FFF9]" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-transparent p-2 text-white outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-3 focus-within:border-[#80FFF9] transition">
              <Mail size={18} className="text-[#80FFF9]" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
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
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-transparent p-2 text-white outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 rounded-md font-medium hover:opacity-90 transition-all duration-300 shadow-md shadow-indigo-500/20"
          >
            {loading ? "Creating..." : <> <UserPlus size={18} /> Register </>}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#80FFF9] hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <LogIn size={14} /> Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

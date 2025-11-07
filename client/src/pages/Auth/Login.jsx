import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/auth/login", formData);

      // ✅ Salvăm tokenul în localStorage
      localStorage.setItem("token", data.token);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white">
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a]/80 p-10 rounded-xl shadow-xl space-y-4 w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#0e0e0e]/70 border border-white/10 focus:border-[#80FFF9] outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#0e0e0e]/70 border border-white/10 focus:border-[#80FFF9] outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-2 rounded-md font-medium hover:opacity-90 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

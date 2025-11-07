import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/auth/register", form);
      localStorage.setItem("token", data.token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] p-8 rounded-lg border border-white/10 w-[400px]"
      >
        <h1 className="text-white text-2xl font-semibold mb-6 text-center">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-4 px-4 py-2 bg-[#0e0e0e] border border-white/10 rounded text-white"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 px-4 py-2 bg-[#0e0e0e] border border-white/10 rounded text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-6 px-4 py-2 bg-[#0e0e0e] border border-white/10 rounded text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-2 rounded-md text-white font-medium hover:opacity-90 transition"
        >
          Register
        </button>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-[#80FFF9] hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;

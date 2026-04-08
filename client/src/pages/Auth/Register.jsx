import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { toast } from "sonner";
  
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
    try { const { data } = await axios.post( `${import.meta.env.VITE_API_URL}/auth/register`, form);
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
    <div className='overflow-hidden min-h-screen flex items-center justify-center bg-[#E8E8E8] relative'>
      
      <button onClick={() => navigate("/")} className='bg-[#1E1E1E] text-white px-20 pt-3 pb-3 rounded-xl hover:bg-[#333] absolute top-20 left-10 z-10'>
        Back
      </button>

      <div>
        <img src="SIGNUP.png" alt="" className='absolute top-30'/>
        <p className='font-bold tracking-[-13%] absolute top-50 left-195 text-9xl'>SIGN UP</p>
      </div>

      

      <div className='w-full max-w-md mt-40 ml-10'>
        <form action="" onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <label htmlFor="fullName">Full Name</label>
          <input type="text" name='name' placeholder="Enter your full name" value={form.name} required onChange={handleChange} className='border border-[#1E1E1E] rounded-xl py-2 px-4 bg-[#1E1E1E]/10' />
          <label htmlFor="email">Email</label>
          <input type="email" name='email' placeholder="Enter your email address" value={form.email} required onChange={handleChange} className='border border-[#1E1E1E] rounded-xl py-2 px-4 bg-[#1E1E1E]/10' />
          <label htmlFor="password">Password</label>
          <input type="password" name='password' placeholder="Enter your password" value={form.password} required onChange={handleChange} className='border border-[#1E1E1E] rounded-xl py-2 px-4 bg-[#1E1E1E]/10' />
          <button type="submit" disabled={loading} className='bg-[#1E1E1E] text-white pt-3 pb-3 rounded-xl hover:bg-[#333] mt-5'>Continue</button>
        </form>

        <div className="text-center mt-6 text-sm text-[#1E1E1E]">
          Already have an account?
          <Link to="/login" className="text-[#1E1E1E] hover:underline">
            Login
          </Link>
        </div>

      </div>

      <div className=''>
        <img src="INVBLACK.png" alt="" className='left-300 bottom-180 rotate-20 absolute' />
        <img src="INVBLACK.png" alt="" className='left-315 top-150 rotate-340 absolute' />
        <img src="Chenar.png" alt="" className='left-0 top-10 absolute'/>
        <img src="Circles.png" alt="" className='right-0 bottom-75 absolute' />
        <img src="invoiceGenAi1.png" alt="" className='left-60 top-107 absolute'/>
        <img src="invoiceGenAi2.png" alt="" className='right-155 bottom-162 absolute'/>
      </div>
      

    </div>
  )
}

export default Register

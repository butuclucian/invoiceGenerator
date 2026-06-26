import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        form
      );
      localStorage.setItem("token", data.token);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strengthScore = calculateStrength(form.password);
  const strengthColors = ["bg-transparent", "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-400", "bg-green-600"];
  const strengthWidths = ["w-0", "w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"];
  const strengthLabels = ["", "Foarte slabă", "Slabă", "Acceptabilă", "Bună", "Foarte puternică"];

  return (
    <div className="overflow-hidden min-h-screen flex items-center justify-center bg-[#E8E8E8] relative">
      <button onClick={() => navigate("/")} className="bg-[#1E1E1E] text-white px-20 pt-3 pb-3 rounded-xl hover:bg-[#333] absolute top-20 left-10 z-10">
        Back
      </button>

      <div>
        <img src="SIGNUP.png" alt="" className="absolute top-30" />
        <p className="font-bold tracking-[-13%] absolute top-50 left-195 text-9xl">SIGN UP</p>
      </div>

      <div className="w-full max-w-md mt-40 ml-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="name">Full Name</label>
          <input type="text" name="name" placeholder="Enter your full name" value={form.name} required onChange={handleChange} className="border border-[#1E1E1E] rounded-xl py-2 px-4 bg-[#1E1E1E]/10"/>
          
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Enter your email address" value={form.email} required onChange={handleChange} className="border border-[#1E1E1E] rounded-xl py-2 px-4 bg-[#1E1E1E]/10"/>

          <label htmlFor="password">Password</label>
          <div className="relative w-full">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={form.password} required onChange={handleChange} className="border border-[#1E1E1E] rounded-xl py-2 px-4 bg-[#1E1E1E]/10 w-full"/>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-[#1E1E1E] hover:text-purple-600 focus:outline-none" >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>

          <div className="h-6 mt-1">
            {form.password.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="w-full h-2 border-2 border-[#1E1E1E] bg-white rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strengthColors[strengthScore]} ${strengthWidths[strengthScore]} border-r-2 border-[#1E1E1E]`}></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-right text-[#1E1E1E]">
                  {strengthLabels[strengthScore]}
                </p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="bg-[#1E1E1E] text-white pt-3 pb-3 rounded-xl hover:bg-[#333] mt-5" >
            {loading ? "Loading..." : "Continue"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-[#1E1E1E]">
          Already have an account?
          <Link to="/login" className="text-[#1E1E1E] hover:underline font-bold ml-1">
            Login
          </Link>
        </div>
      </div>

      <div className="">
        <img src="INVBLACK.png" alt="" className="left-300 bottom-180 rotate-20 absolute" />
        <img src="INVBLACK.png" alt="" className="left-315 top-150 rotate-340 absolute" />
        <img src="Chenar.png" alt="" className="left-0 top-10 absolute" />
        <img src="Circles.png" alt="" className="right-0 bottom-75 absolute" />
        <img src="invoiceGenAi1.png" alt="" className="left-60 top-107 absolute" />
        <img src="invoiceGenAi2.png" alt="" className="right-155 bottom-162 absolute" />
      </div>
    </div>
  );
};

export default Register;
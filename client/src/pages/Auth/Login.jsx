import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className='overflow-hidden min-h-screen flex items-center justify-center bg-[#E8E8E8] relative'>
      
      <button onClick={() => navigate("/")} className='bg-[#1E1E1E] text-white px-20 pt-3 pb-3 rounded-xl hover:bg-[#333] absolute top-20 left-10 z-10'>
        Back
      </button>

      <div>
        <img src="SIGNIN.png" alt="" className='absolute top-30'/>
        <p className='font-bold tracking-[-13%] absolute top-50 left-195 text-9xl'>SIGN IN</p>
      </div>

      

      <div className='w-full max-w-md mt-30 ml-10'>
        <form action="" className='flex flex-col gap-3'>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email address" className='border border-[#1E1E1E] rounded-xl py-2 px-4 bg-[#1E1E1E]/10'/>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" className='border border-[#1E1E1E] rounded-xl py-2 px-4 bg-[#1E1E1E]/10'/>
          <button type="submit" className='bg-[#1E1E1E] text-white pt-3 pb-3 rounded-xl hover:bg-[#333] mt-5'>Continue</button>
        </form>

        <div className="text-center mt-6 text-sm text-[#1E1E1E]">
          Already have an account?
          <Link to="/register" className="text-[#1E1E1E] hover:underline">
            Register
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

export default Login

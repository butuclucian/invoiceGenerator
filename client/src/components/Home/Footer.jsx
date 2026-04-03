import React from 'react'

const Footer = () => {
  return (
      <div className='w-full p-4 bg-[#1E1E1E] mb-2 rounded-4xl flex items-center justify-between relative'>
        <div>
          <p className='w-10 text-white font-bold text-[190px] tracking-[-11%] leading-[0.8] stroke-white [-webkit-text-stroke:2px_white]'>START CREATING YOUR <span className="text-transparent tracking-[-10%]">INVOICE</span> NOW!</p>
        </div>
        
        <div className='text-white -translate-x-150'>
          
          <div className='p-5 items-start'>
            <h1 className='font-bold text-3xl tracking-[-11%]'>PRODUCT</h1>
            <div className='p-5 items-start'>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>Dashboard</p>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>AI Generator</p>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>Invoices</p>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>Pricing</p>
            </div>
          </div>

          <div className='p-5 items-start'>
            <h1 className='font-bold text-3xl tracking-[-11%]'>COMPANY</h1>
            <div className='p-5 items-start'>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>Dashboard</p>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>AI Generator</p>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>Invoices</p>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>Pricing</p>
            </div>
          </div>

          <div className='p-5 items-start'>
            <h1 className='font-bold text-3xl tracking-[-11%]'>PRODUCT</h1>
            <div className='p-5 items-start'>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>Dashboard</p>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>AI Generator</p>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>Invoices</p>
              <p className='font-light mt-1.5 text-xl hover:text-cyan-500 cursor-pointer'>Pricing</p>
            </div>
          </div>

        </div>

        <img src="/INV.png" alt="" className='absolute translate-x-300 rotate-270 opacity-40'/>

      </div>
  )
}

export default Footer

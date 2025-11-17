import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Admin/Sidebar'
import Navbar from '../../components/Admin/Navbar'
import AIChatPanel from '../../components/Admin/AIChatPanel'

const Dashboard = () => {
  return (
    <div className="flex bg-[#0e0e0e] min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col relative">

        {/* Fix: da spațiu sub navbar */}
        <div className="pt-20"> 
          <Navbar />

          <main className="p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>

        <AIChatPanel />
      </div>
    </div>
  )
}

export default Dashboard

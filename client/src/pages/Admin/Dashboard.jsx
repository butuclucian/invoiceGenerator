import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Admin/Sidebar'
import Navbar from '../../components/Admin/Navbar'
import AIChatPanel from '../../components/Admin/AIChatPanel'

const Dashboard = () => {
  return (
    <div className="flex bg-[#0e0e0e] min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        <AIChatPanel />
      </div>
    </div>
  )
}

export default Dashboard

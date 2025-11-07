import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, PieChart as PieIcon, BarChart3 } from "lucide-react";

const Reports = () => {
  // Dummy Data
  const statusData = [
    { name: "Paid", value: 12 },
    { name: "Sent", value: 8 },
    { name: "Draft", value: 5 },
    { name: "Overdue", value: 3 },
  ];

  const revenueData = [
    { month: "Jan", total: 1200 },
    { month: "Feb", total: 2100 },
    { month: "Mar", total: 1850 },
    { month: "Apr", total: 2400 },
    { month: "May", total: 2800 },
    { month: "Jun", total: 1900 },
  ];

  const clientData = [
    { name: "TechNova", total: 4800 },
    { name: "BlueSky", total: 3700 },
    { name: "AlphaSoft", total: 3200 },
    { name: "NextGen", total: 2700 },
  ];

  const COLORS = ["#00E0FF", "#6A5ACD", "#9C27B0", "#FF6B6B"];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-10 pt-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
    <div>
      <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
        <BarChart3 className="text-[#80FFF9]" size={26} />
        Reports
      </h1>
      <p className="text-gray-400 text-sm">
        Visualize your business insights and performance metrics
      </p>
    </div>
  </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Invoice Status Pie Chart */}
        <div className="bg-[#1a1a1a]/80 p-6 rounded-xl border border-white/10 shadow-lg shadow-indigo-500/10">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="text-[#80FFF9]" size={20} />
            <h2 className="text-xl font-semibold text-white">
              Invoice Status Overview
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Over Time */}
        <div className="bg-[#1a1a1a]/80 p-6 rounded-xl border border-white/10 shadow-lg shadow-indigo-500/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-[#80FFF9]" size={20} />
            <h2 className="text-xl font-semibold text-white">
              Revenue Over Time
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#80FFF9"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Clients by Revenue */}
        <div className="bg-[#1a1a1a]/80 p-6 rounded-xl border border-white/10 shadow-lg shadow-indigo-500/10 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-[#80FFF9]" size={20} />
            <h2 className="text-xl font-semibold text-white">
              Top Clients by Total Invoiced
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={clientData} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" stroke="#888" />
              <YAxis dataKey="name" type="category" stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="total" fill="#80FFF9" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;

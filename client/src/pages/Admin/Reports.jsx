import React, { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,} from "recharts";
import { TrendingUp, PieChart as PieIcon, BarChart3 } from "lucide-react";
import API from "../../utils/api";
import { toast } from "sonner";

const Reports = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#00E0FF", "#6A5ACD", "#9C27B0", "#FF6B6B"];

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await API.get("/invoices");
        setInvoices(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load reports data");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading reports...
      </div>
    );
  }

  const statusCounts = invoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: statusCounts[key],
  }));

  const monthlyRevenue = {};
  invoices.forEach((inv) => {
    if (inv.status === "paid" && inv.date) {
      const month = new Date(inv.date).toLocaleString("default", {
        month: "short",
      });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.total;
    }
  });

  const revenueData = Object.entries(monthlyRevenue).map(([month, total]) => ({
    month,
    total,
  }));

  const clientTotals = {};
  invoices.forEach((inv) => {
    if (inv.client && inv.total) {
      const clientName =
        inv.client?.name || inv.client?.email || "Unknown Client";
      clientTotals[clientName] = (clientTotals[clientName] || 0) + inv.total;
    }
  });

  const clientData = Object.entries(clientTotals)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-10 overflow-hidden pb-16 p-8 pt-30 space-y-8">
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
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

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-[#1a1a1a]/80 p-6 rounded-xl border border-white/10 shadow-lg shadow-indigo-500/10">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="text-[#80FFF9]" size={20} />
            <h2 className="text-xl font-semibold text-white">
              Invoice Status Overvirew
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
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
              <Line type="monotone" dataKey="total" stroke="#80FFF9"strokeWidth={2} dot={{ r: 5 }}/>
            </LineChart>
          </ResponsiveContainer>

        </div>

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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign, PieChart as PieIcon, AlertCircle, CheckCircle2, Plus, Users } from "lucide-react";
import API from "../../utils/api";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/invoices");
        const paid = data.filter(i => i.status === 'paid');
        const unpaid = data.filter(i => i.status !== 'paid');
        const overdueInvoices = data.filter(i => i.status === 'overdue');
        
        setStats({
          totalSales: paid.reduce((acc, i) => acc + i.total, 0),
          paidCount: paid.length,
          unpaidCount: unpaid.length,
          pieData: [
            { name: 'Încasate', value: paid.length },
            { name: 'Neîncasate', value: unpaid.length },
          ]
        });
        setOverdue(overdueInvoices.slice(0, 3));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-white p-10">Loading Dashboard...</div>;

  const kpis = [
    { title: "Vânzări Totale", val: `$${stats.totalSales.toFixed(2)}`, icon: <DollarSign />, color: "text-green-400" },
    { title: "Facturi Încasate", val: stats.paidCount, icon: <CheckCircle2 />, color: "text-[#80FFF9]" },
    { title: "Facturi Neîncasate", val: stats.unpaidCount, icon: <AlertCircle />, color: "text-red-400" },
  ];

  return (
    <div className="p-8 pt-30 space-y-8">
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((k, i) => (
          <div key={i} className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-gray-400 text-sm">{k.title}</p>
              <h3 className={`text-2xl font-bold ${k.color} mt-1`}>{k.val}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-white/5 ${k.color}`}>{k.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-white/10 lg:col-span-1 h-[300px]">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><PieIcon size={18} className="text-[#80FFF9]"/> Status Facturi</h2>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={stats.pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                <Cell fill="#80FFF9" />
                <Cell fill="#FF6B6B" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-white/10 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
            <AlertCircle size={20} /> Urgente
          </h2>
          {overdue.length > 0 ? (
            <div className="space-y-4">
              {overdue.map(inv => (
                <div key={inv._id} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm">{inv.invoice_number}</span>
                  <span className="text-red-400 font-bold">${inv.total}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm italic">Nicio factură întârziată!</p>}
        </div>

        <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-white/10 flex flex-col justify-center gap-4">
          <h2 className="text-lg font-semibold text-white">Acțiuni</h2>
          <button onClick={() => navigate("/dashboard/invoices/create")} className="flex items-center gap-3 bg-[#80FFF9]/10 text-[#80FFF9] p-4 rounded-xl hover:bg-[#80FFF9]/20 transition">
            <Plus size={20} /> Factură Nouă
          </button>
          <button onClick={() => navigate("/dashboard/clients/add")} className="flex items-center gap-3 bg-white/5 text-white p-4 rounded-xl hover:bg-white/10 transition">
            <Users size={20} /> Client Nou
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
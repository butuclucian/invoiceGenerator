import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  DollarSign,
  Lock,
  PieChart as PieIcon,
  AlertCircle,
  CheckCircle2,
  Plus,
  Users,
  Loader2,
} from "lucide-react";
import API from "../../utils/api";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("Free");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setPlan("Free");
          setChecking(false);
          return;
        }
        const { data } = await API.get("/subscription/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlan(data?.plan || "Free");
      } catch {
        setPlan("Free");
      } finally {
        setChecking(false);
      }
    };
    checkSubscription();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/invoices");
        const paid = data.filter((i) => i.status === "paid");
        const unpaid = data.filter((i) => i.status !== "paid");
        const overdueInvoices = data.filter((i) => i.status === "overdue");

        setStats({
          totalSales: paid.reduce((acc, i) => acc + i.total, 0),
          paidCount: paid.length,
          unpaidCount: unpaid.length,
          pieData: [
            { name: "Încasate", value: paid.length },
            { name: "Neîncasate", value: unpaid.length },
          ],
        });
        setOverdue(overdueInvoices.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-white p-10">Se încarcă panoul principal...</div>
    );

  const kpis = [
    {
      title: "Vânzări Totale",
      val: `${stats.totalSales.toFixed(2)} RON`,
      icon: <DollarSign />,
      color: "text-green-400",
    },
    {
      title: "Facturi Încasate",
      val: `${stats.paidCount}`,
      icon: <CheckCircle2 />,
      color: "text-[#80FFF9]",
    },
    {
      title: "Facturi Neîncasate",
      val: `${stats.unpaidCount}`,
      icon: <AlertCircle />,
      color: "text-red-400",
    },
  ];

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  const isAllowed = ["Pro", "Enterprise"].includes(plan);

  return (
    <div className="p-8 pt-30 space-y-8">
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((k, i) => (
          <div
            key={i}
            className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg"
          >
            <div>
              <p className="text-gray-400 text-sm">{k.title}</p>
              <h3 className={`text-2xl font-bold ${k.color} mt-1`}>{k.val}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-white/5 ${k.color}`}>
              {k.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-white/10 lg:col-span-1 h-[300px]">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <PieIcon size={18} className="text-[#80FFF9]" /> Status Facturi
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={stats.pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#80FFF9" />
                <Cell fill="#FF6B6B" />
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#111", border: "none" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-white/10 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
            <AlertCircle size={20} /> Urgente
          </h2>
          {overdue.length > 0 ? (
            <div className="space-y-4">
              {overdue.map((inv) => (
                <div
                  key={inv._id}
                  className="flex justify-between items-center border-b border-white/5 pb-2"
                >
                  <span className="text-sm">{inv.invoice_number}</span>
                  <span className="text-red-400 font-bold">${inv.total}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Nicio factură întârziată!
            </p>
          )}
        </div>

        <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white mb-2">
            Acțiuni Rapide
          </h2>

          <button
            onClick={() => navigate("/dashboard/invoices/create")}
            className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-[#80FFF9]/10 border border-transparent hover:border-[#80FFF9]/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#80FFF9]/10 rounded-lg text-[#80FFF9]">
                <Plus size={18} />
              </div>
              <span className="font-medium text-gray-200">Factură Nouă</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/dashboard/clients/add")}
            className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg text-white">
                <Users size={18} />
              </div>
              <span className="font-medium text-gray-200">Client Nou</span>
            </div>
          </button>
        </div>

        <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-white/10 lg:col-span-3 relative overflow-hidden h-[300px]">
          <h2 className="text-lg font-semibold mb-4 text-white">
            {isAllowed
              ? "Raport Financiar Avansat"
              : "Raport Financiar Avansat (Preview)"}
          </h2>

          {isAllowed ? (
            <>
            </>
          ) : (
            <>
              <div className="relative w-full h-[200px] bg-white/5 rounded-xl border border-white/5 p-4 opacity-50">
                <div className="w-full h-4 bg-white/10 rounded mb-4 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-white/5 rounded"></div>
                  <div className="h-32 bg-white/5 rounded"></div>
                </div>
              </div>

              <div className="absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="w-16 h-16 bg-[#80FFF9]/10 rounded-full flex items-center justify-center mb-2">
                  <Lock size={32} className="text-[#80FFF9]" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Deblochează Rapoarte Pro
                </h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  Vizualizează statistici detaliate, proiecții de venituri și
                  exporturi avansate cu un cont Pro.
                </p>
                <button
                  onClick={() => navigate("/dashboard/subscription")}
                  className="w-80 py-3 bg-white hover:bg-gray-100 text-black rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  Fa Upgrade la Pro
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

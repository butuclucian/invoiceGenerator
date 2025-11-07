import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { DollarSign, TrendingUp, CreditCard, FileText, Calculator } from "lucide-react";

const Accounting = () => {
  const stats = [
    {
      title: "Total Income",
      value: "$12,450",
      icon: <DollarSign size={22} />,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Expenses",
      value: "$4,800",
      icon: <CreditCard size={22} />,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      title: "Profit",
      value: "$7,650",
      icon: <TrendingUp size={22} />,
      color: "text-[#80FFF9]",
      bg: "bg-[#80FFF9]/10",
    },
    {
      title: "Outstanding Invoices",
      value: "6 Pending",
      icon: <FileText size={22} />,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
  ];

  const cashFlowData = [
    { month: "Jan", income: 2400, expenses: 1400 },
    { month: "Feb", income: 2800, expenses: 1600 },
    { month: "Mar", income: 3200, expenses: 2100 },
    { month: "Apr", income: 2700, expenses: 1900 },
    { month: "May", income: 3500, expenses: 2200 },
    { month: "Jun", income: 3100, expenses: 1800 },
  ];

  const transactions = [
    { id: 1, type: "Invoice Payment", amount: "$850", status: "Completed", date: "2025-10-15" },
    { id: 2, type: "Expense", amount: "$120", status: "Approved", date: "2025-10-14" },
    { id: 3, type: "Invoice Payment", amount: "$1,200", status: "Pending", date: "2025-10-12" },
    { id: 4, type: "Refund", amount: "$300", status: "Processed", date: "2025-10-10" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-10 pt-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
          <Calculator className="text-[#80FFF9]" size={26} />
          Accounting
        </h1>
        <p className="text-gray-400 text-sm">
          Manage your financial overview and transactions
        </p>
      </div>
    </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-5 rounded-xl border border-white/10 shadow-md shadow-indigo-500/10 ${s.bg}`}
          >
            <div>
              <h3 className="text-gray-400 text-sm">{s.title}</h3>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
            <div className={`p-3 rounded-lg border border-white/10 ${s.bg}`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-[#1a1a1a]/80 p-6 rounded-xl border border-white/10 shadow-lg shadow-indigo-500/10 mb-10">
        <h2 className="text-xl font-semibold text-[#80FFF9] mb-4">
          Cash Flow (Income vs Expenses)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cashFlowData}>
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
            <Line type="monotone" dataKey="income" stroke="#80FFF9" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#ff6b6b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#1a1a1a]/80 p-6 rounded-xl border border-white/10 shadow-lg shadow-indigo-500/10">
        <h2 className="text-xl font-semibold text-[#80FFF9] mb-4">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-3 px-4">{t.type}</td>
                  <td className="py-3 px-4 text-[#80FFF9] font-semibold">{t.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        t.status === "Completed"
                          ? "bg-green-500/10 text-green-400"
                          : t.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : t.status === "Processed"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Accounting;

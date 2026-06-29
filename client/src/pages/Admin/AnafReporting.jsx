import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Download, Filter, Calendar, Percent, Landmark } from "lucide-react";
import { toast } from "sonner";
import API from "../../utils/api";

const AnafReporting = () => {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currency, setCurrency] = useState("RON");
  
  const [reportData, setReportData] = useState({
    totalIncome: 0,
    estimatedExpenses: 0,
    netProfit: 0,
    impozit: 0,
    cass: 0,
    cas: 0,
    paidInvoicesCount: 0
  });

  const formatCurrency = (value, curr = "RON") => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 2,
    })
      .format(value)
      .replace(/\s/g, " ");
  };

  const calculateAnafData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const invRes = await API.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let userCurrency = "RON";
      try {
        const { data: userData } = await API.get("/users/me");
        if (userData?.billing_profile?.currency) {
          userCurrency = userData.billing_profile.currency;
          setCurrency(userCurrency);
        }
      } catch (e) {
        console.error("Could not fetch user currency:", e);
      }

      const paidInvoicesInYear = invRes.data.filter((inv) => {
        if (inv.status !== "paid") return false;
        const invYear = new Date(inv.date).getFullYear();
        return invYear === parseInt(selectedYear);
      });

      const totalIncome = paidInvoicesInYear.reduce((sum, inv) => sum + (inv.subtotal || inv.total), 0);

      const estimatedExpenses = totalIncome * 0.15;
      const netProfit = totalIncome - estimatedExpenses > 0 ? totalIncome - estimatedExpenses : 0;
      
      const impozit = netProfit * 0.10;
      let cass = 0;
      let cas = 0;
      const salariuMinim2026 = 4000;
      const plafon6Salarii = salariuMinim2026 * 6;
      const plafon12Salarii = salariuMinim2026 * 12;

      if (netProfit >= plafon12Salarii) {
        cass = plafon12Salarii * 0.10;
        cas = plafon12Salarii * 0.25;
      } else if (netProfit >= plafon6Salarii) {
        cass = plafon6Salarii * 0.10;
      }

      setReportData({
        totalIncome,
        estimatedExpenses,
        netProfit,
        impozit,
        cass,
        cas,
        paidInvoicesCount: paidInvoicesInYear.length
      });

    } catch (err) {
      console.error("ANAF Calculation Error:", err);
      toast.error("Failed to compile ANAF fiscal report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateAnafData();
  }, [selectedYear]);


  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-10 overflow-hidden pb-16 p-8 pt-30 space-y-8">
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="text-[#80FFF9]" size={26} />
            ANAF Reporting Portal
          </h1>
          <p className="text-gray-400 text-sm">
            Generare date pentru Declarația Unică și centralizator venituri anuale
            {/* asdsa */}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#1a1a1a]/70 border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-[#80FFF9]" />
          <span className="text-gray-300">Anul fiscal raportat:</span>
        </div>

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="cursor-pointer bg-[#1a1a1a] border border-white/10 text-gray-200 px-4 py-2 rounded-md focus:border-[#80FFF9] outline-none">
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

        <span className="text-gray-400 text-sm">
          Sunt analizate {reportData.paidInvoicesCount} facturi încasate cu succes.
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-400 animate-pulse">Se calculează fișele fiscale...</p>
        </div>
      ) : (
        <div className="space-y-8 max-w-5xl mx-auto">
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a]/60 border border-white/10 rounded-xl p-6">
              <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase block mb-1">Venit Brut Realizat</span>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(reportData.totalIncome, currency)}</p>
              <span className="text-[11px] text-gray-500 block mt-2">Baza: Facturi starea Paid</span>
            </div>

            <div className="bg-[#1a1a1a]/60 border border-white/10 rounded-xl p-6">
              <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase block mb-1">Cheltuieli Deductibile</span>
              <p className="text-2xl font-bold text-red-400">-{formatCurrency(reportData.estimatedExpenses, currency)}</p>
              <span className="text-[11px] text-gray-500 block mt-2">Estimare operațională (15%)</span>
            </div>

            <div className="bg-[#1a1a1a]/60 border border-white/10 rounded-xl p-6 bg-gradient-to-br from-indigo-600/5 to-transparent">
              <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase block mb-1">Venit Net Impozitabil</span>
              <p className="text-2xl font-bold text-[#80FFF9]">{formatCurrency(reportData.netProfit, currency)}</p>
              <span className="text-[11px] text-gray-500 block mt-2">Baza de calcul pentru taxe</span>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-[#80FFF9] mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
              <Landmark size={20} />
              Ghid Compleat Casete - Declarația Unică (D212)
            </h2>
            
            <p className="text-sm text-gray-400 mb-6">
              Următoarele valori au fost determinate conform Codului Fiscal român în vigoare pentru anul {selectedYear}. Copiază aceste sume direct în PDF-ul inteligent ANAF la Secțiunea I - Venituri Realizate.
            </p>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between p-4 bg-[#0e0e0e]/50 border border-white/5 rounded-lg items-start sm:items-center">
                <div>
                  <p className="font-medium text-gray-200">Subsecțiunea I.1.1.A - Venit Brut</p>
                  <p className="text-xs text-gray-500">Caseta 1. Venit brut încasat în cursul anului</p>
                </div>
                <p className="text-lg font-mono text-white mt-2 sm:mt-0">{formatCurrency(reportData.totalIncome, currency)}</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between p-4 bg-[#0e0e0e]/50 border border-white/5 rounded-lg items-start sm:items-center">
                <div>
                  <p className="font-medium text-gray-200">Subsecțiunea I.1.1.A - Cheltuieli</p>
                  <p className="text-xs text-gray-500">Caseta 2. Cheltuieli deductibile efectuate</p>
                </div>
                <p className="text-lg font-mono text-white mt-2 sm:mt-0">{formatCurrency(reportData.estimatedExpenses, currency)}</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between p-4 bg-[#0e0e0e]/50 border border-white/5 rounded-lg items-start sm:items-center bg-gradient-to-r from-[#80FFF9]/5 to-transparent">
                <div>
                  <p className="font-medium text-[#80FFF9]">Subsecțiunea I.1.1.A - Venit Net Anual</p>
                  <p className="text-xs text-gray-400">Caseta 3. Venit net anual realizat (Profit curent)</p>
                </div>
                <p className="text-lg font-mono text-[#80FFF9] font-semibold mt-2 sm:mt-0">{formatCurrency(reportData.netProfit, currency)}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
              <Percent size={20} className="text-indigo-400" />
              Calcul Taxe Anuale Recalculate
            </h2>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-[#0e0e0e]/40 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400 block mb-1">Impozit pe Venit (10%)</span>
                <p className="text-xl font-mono font-bold text-white">{formatCurrency(reportData.impozit, currency)}</p>
              </div>

              <div className="p-4 bg-[#0e0e0e]/40 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400 block mb-1">Contribuție Sănătate (CASS)</span>
                <p className="text-xl font-mono font-bold text-white">{formatCurrency(reportData.cass, currency)}</p>
                <span className="text-[10px] text-gray-500 block mt-1">Calculat la plafoane de salarii</span>
              </div>

              <div className="p-4 bg-[#0e0e0e]/40 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400 block mb-1">Contribuție Pensie (CAS)</span>
                <p className="text-xl font-mono font-bold text-white">{formatCurrency(reportData.cas, currency)}</p>
                <span className="text-[10px] text-gray-500 block mt-1">Plafon minim 12 salarii</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-600/10 border border-indigo-600/30 rounded-xl flex justify-between items-center">
              <span className="text-sm text-gray-300 font-medium">Total Obligații de Plată estimate către Bugetul de Stat:</span>
              <span className="text-xl font-bold text-white font-mono">
                {formatCurrency(reportData.impozit + reportData.cass + reportData.cas, currency)}
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AnafReporting;
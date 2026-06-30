import React, { useEffect, useState } from "react";
import { Repeat, Eye, Edit, Trash2, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const RecurringInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRecurringInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Trebuie să fii conectat pentru a vizualiza facturile");
        return;
      }

      const { data } = await API.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const recurringOnly = data.filter((inv) => inv.recurring === true);
      setInvoices(recurringOnly);
    } catch (err) {
      if (err.response?.status === 401)
        toast.error("Neautorizat. Contectează-te și încearcă din nou.");
      else toast.error("Eroare la încărcarea facturilor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Factura recurentă a fost ștearsă cu succs");
      fetchRecurringInvoices();
    } catch {
      toast.error("Ștergerea facturii recurente a eșuat");
    }
  };

  const handleEdit = (invoiceId) => {
    navigate(`/dashboard/invoices/${invoiceId}/edit`);
  };

  const handleDownload = (invoiceNumber) => {
    toast.info(`Downloading ${invoiceNumber} (mock only)`);
  };

  const handlePreview = (invoiceId) => {
    navigate(`/dashboard/invoices/${invoiceId}`);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#0e0e0e] relative pt-30 space-y-8">
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            <Repeat className="text-[#80FFF9]" size={26} />
            Facturi Recurente
          </h1>
          <p className="text-gray-400 text-sm mt-3">
            Gestionează și urmărește toate facturile recurente
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 animate-pulse">
          Loading recurring invoices...
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/20 rounded-xl bg-[#1a1a1a]/60">
          <Repeat className="w-16 h-16 text-white/20 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-300">
            Nicio Factură Recurentă Găsită!
          </h3>
          <p className="text-sm text-gray-500 mt-3">
            Încearcă să creezi o factură recurentă!
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto bg-[#1a1a1a]/70 border border-white/10 rounded-xl">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="p-4 text-left">Factură</th>
                  <th className="p-4 text-left">Client</th>
                  <th className="p-4 text-left">Frecvență</th>
                  <th className="p-4 text-left">Următoarea Facturare</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Acțiuni</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4 text-gray-200 text-left align-middle font-medium">
                      {inv.invoice_number}
                    </td>

                    <td className="p-4 text-left align-middle">
                      <p className="text-gray-200">{inv.client?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{inv.client?.email || "N/A"}</p>
                    </td>

                    <td className="p-4 text-left align-middle">
                      {inv.frequency || "Monthly"}
                    </td>

                    <td className="p-4 text-left align-middle">
                      {formatDate(inv.next_billing)}
                    </td>

                    <td className="p-4 text-left align-middle">
                      <span
                        className={`text-xs px-3 py-1 rounded-full capitalize ${
                          inv.status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : inv.status === "sent"
                            ? "bg-blue-500/20 text-blue-400"
                            : inv.status === "draft"
                            ? "bg-gray-500/20 text-gray-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="p-4 text-right flex justify-end gap-2 relative">
                      
                      <button onClick={() => handlePreview(inv._id)} className="group relative p-2 hover:text-[#80FFF9]" >
                        <Eye size={16} />
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2  px-3 py-1.5 bg-black/90 text-[12px] text-white rounded-md shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100 transition-transform duration-150 scale-95 group-hover:scale-100">
                          Previzualizare
                        </span>
                      </button>

                      <button onClick={() => handleEdit(inv._id)} className="group relative p-2 hover:text-indigo-400" >
                        <Edit size={16} />
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2  px-3 py-1.5 bg-black/90 text-[12px] text-white rounded-md  opacity-0 group-hover:opacity-100 transition-transform duration-150  scale-95 group-hover:scale-100">
                          Editare
                        </span>
                      </button>

                      <button onClick={() => handleDownload(inv.invoice_number)} className="group relative p-2 hover:text-green-400" >
                        <Download size={16} />
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2  px-3 py-1.5 bg-black/90 text-[12px] text-white rounded-md shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100 transition-transform duration-150 scale-95 group-hover:scale-100">
                          Descărcare
                        </span>
                      </button>

                      <button onClick={() => handleDelete(inv._id)} className="group relative p-2 hover:text-red-400" >
                        <Trash2 size={16} />
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2  px-3 py-1.5 bg-black/90 text-[12px] text-white rounded-md shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100 transition-transform duration-150 scale-95 group-hover:scale-100">
                          Ștergere
                        </span>
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {invoices.map((inv) => (
              <div key={inv._id} className="bg-[#1a1a1a]/70 border border-white/10 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start">
                  <p className="text-lg font-semibold text-gray-200">
                    {inv.invoice_number}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs capitalize ${
                      inv.status === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : inv.status === "sent"
                        ? "bg-blue-500/20 text-blue-400"
                        : inv.status === "draft"
                        ? "bg-gray-500/20 text-gray-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-300">
                  <p><span className="text-gray-400">Client:</span> {inv.client?.name || "Unknown"}</p>
                  <p><span className="text-gray-400">Email:</span> {inv.client?.email || "N/A"}</p>
                  <p><span className="text-gray-400">Frecvență:</span> {inv.frequency || "Monthly"}</p>
                  <p><span className="text-gray-400">Următoarea Facturare:</span> {formatDate(inv.next_billing)}</p>
                </div>

                <div className="mt-4 flex justify-end gap-4 text-gray-400">
                  <button onClick={() => handlePreview(inv._id)} className="hover:text-[#80FFF9]">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleEdit(inv._id)} className="hover:text-indigo-400">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDownload(inv.invoice_number)} className="hover:text-green-400">
                    <Download size={18} />
                  </button>
                  <button onClick={() => handleDelete(inv._id)} className="hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecurringInvoice;

import React, { useEffect, useState } from "react";
import {
  FileText,
  Edit,
  Trash2,
  Download,
  Filter,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api"; // ✅ axios instance
import CreateInvoicePopup from "../../components/Admin/CreateInvoicePopup";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch invoices from backend
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to view invoices");
        return;
      }

      const { data } = await API.get("/invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvoices(data);
      setFilteredInvoices(data);
    } catch (err) {
      console.error("❌ Fetch invoices error:", err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
      } else {
        toast.error("Failed to load invoices");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ✅ Filter logic
  useEffect(() => {
    if (filterStatus === "all") setFilteredInvoices(invoices);
    else setFilteredInvoices(invoices.filter((i) => i.status === filterStatus));
  }, [filterStatus, invoices]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/invoices/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (err) {
      toast.error("Failed to delete invoice");
    }
  };

  const handleDownload = (invoiceNumber) => {
    toast.info(`Downloading ${invoiceNumber} (mock only)`);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#0e0e0e]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <FileText className="text-[#80FFF9]" size={26} />
            Invoices
          </h1>
          <p className="text-gray-400 text-sm">
            Manage and track all your invoices
          </p>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-2 rounded-md hover:opacity-90 transition"
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#1a1a1a]/70 border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#80FFF9]" />
          <span className="text-gray-300">Filter by status:</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#0e0e0e]/80 border border-white/10 text-gray-200 px-4 py-2 rounded-md outline-none focus:border-[#80FFF9]"
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <span className="text-gray-400 text-sm">
          Showing {filteredInvoices.length} of {invoices.length}
        </span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-400 animate-pulse">Loading invoices...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/20 rounded-xl bg-[#1a1a1a]/60">
          <FileText className="w-16 h-16 text-white/20 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-300">No invoices</h3>
          <p className="text-sm text-gray-500">Try creating one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((inv) => (
            <div
              key={inv._id}
              className="bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-6 hover:border-[#80FFF9]/40 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{inv.invoice_number}</h2>
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
              </div>

              <p className="text-sm text-gray-400 mb-1">
                {inv.client?.name || "Unknown Client"}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {inv.client?.email || "no-email@example.com"}
              </p>

              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-[#80FFF9] font-semibold">
                  ${Number(inv.total || 0).toFixed(2)}
                </p>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/dashboard/invoices/${inv._id}/edit`)}
                  className="p-2 text-gray-400 hover:text-indigo-400 transition"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDownload(inv.invoice_number)}
                  className="p-2 text-gray-400 hover:text-green-400 transition"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => handleDelete(inv._id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;

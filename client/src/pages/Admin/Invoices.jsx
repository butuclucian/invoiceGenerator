import React, { useState, useEffect } from "react";
import {
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";
import CreateInvoicePopup from "../../components/Admin/CreateInvoicePopup";

const Invoices = () => {
  const { dummyInvoices, dummyClients } = assets;
  const [filteredInvoices, setFilteredInvoices] = useState(dummyInvoices);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredInvoices(dummyInvoices);
    } else {
      setFilteredInvoices(
        dummyInvoices.filter((inv) => inv.status === filterStatus)
      );
    }
  }, [filterStatus]);

  const handleDelete = (invoiceNumber) => {
    toast.info(`Invoice ${invoiceNumber} deleted (dummy only)`);
  };

  const handleDownload = (invoiceNumber) => {
    toast.success(`Downloading PDF for ${invoiceNumber}...`);
  };

  const handleCreateInvoice = (newInvoice) => {
    setFilteredInvoices((prev) => [newInvoice, ...prev]);
    toast.success("Invoice added successfully!");
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#0e0e0e] relative">
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
          Showing {filteredInvoices.length} of {dummyInvoices.length}
        </span>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/20 rounded-xl bg-[#1a1a1a]/60">
          <FileText className="w-16 h-16 text-white/20 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-300">
            No invoices found
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Try changing the filter or create a new invoice.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((inv) => {
            const client = dummyClients.find(
              (c) => c._id === inv.client_id
            );

            return (
              <div
                key={inv._id}
                className="bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-6 hover:border-[#80FFF9]/40 transition-all shadow-md shadow-indigo-500/5"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">
                    {inv.invoice_number}
                  </h2>
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

                {/* Client Info */}
                <div className="mb-3">
                  <p className="text-sm text-gray-400">Client</p>
                  <p className="font-medium text-gray-200">
                    {client?.name || "Unknown Client"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {client?.email || "no-email@example.com"}
                  </p>
                </div>

                {/* Dates */}
                <div className="flex justify-between text-sm text-gray-400 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p>{inv.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Due</p>
                    <p>{inv.due_date || "N/A"}</p>
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-[#80FFF9] font-semibold">
                    ${inv.total.toFixed(2)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => navigate(`/invoices/${inv._id}`)}
                    className="p-2 text-gray-400 hover:text-[#80FFF9] transition"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/invoices/${inv._id}/edit`)}
                    className="p-2 text-gray-400 hover:text-indigo-400 transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDownload(inv.invoice_number)}
                    className="p-2 text-gray-400 hover:text-green-400 transition"
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(inv.invoice_number)}
                    className="p-2 text-gray-400 hover:text-red-400 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Popup create invoice */}
      {showPopup && (
        <div
          className="animate-fadeIn fixed inset-0 flex items-center justify-center z-50"
        >
          <CreateInvoicePopup
            onClose={() => setShowPopup(false)}
            onCreate={handleCreateInvoice}
          />
        </div>
      )}
    </div>
  );
};

export default Invoices;

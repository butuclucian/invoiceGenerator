import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import {
  renderEUTemplate,
  renderUSTemplate,
  renderGlobalTemplate,
  renderEnterpriseTemplate
} from "./templates";

export const generateInvoicePDF = async (invoice, billingProfile, hexToRgb) => {
  if (!billingProfile) return;

  const template = invoice.template || "eu";
  const doc = new jsPDF("p", "mm", "a4");

  const accent = hexToRgb("#0f6c91");
  const gray = [60, 60, 60];

  const formatDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB").replaceAll("/", "-");
  };

  const helpers = {
    accent,
    gray,
    formatDate,
    autoTable,
    QRCode
  };

  if (template === "eu") {
    await renderEUTemplate(doc, invoice, billingProfile, helpers);
  }

  if (template === "us") {
    await renderUSTemplate(doc, invoice, billingProfile, helpers);
  }

  if (template === "global") {
    await renderGlobalTemplate(doc, invoice, billingProfile, helpers);
  }

  if (template === "einvoice") {
    await renderEnterpriseTemplate(doc, invoice, billingProfile, helpers);
  }

  doc.save(`invoice_${invoice.invoice_number}.pdf`);
};
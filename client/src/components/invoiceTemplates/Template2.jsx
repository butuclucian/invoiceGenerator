const Template1 = ({ invoice, billingProfile }) => {
  if (!invoice || !billingProfile) return null;

  const b = billingProfile;
  const c = invoice.client || {};
  const currency = b.currency || "GBP";

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const items = invoice.items || [];

  return (
    <div style={{
      width: "794px",
      minHeight: "1123px",
      backgroundColor: "#F5F2EC",
      padding: "40px 50px",
      fontFamily: "Helvetica, Arial, sans-serif",
      color: "#1a1a1a",
      boxSizing: "border-box",
      position: "relative",
    }}>

      {/* HEADER */}
      <h1 style={{ textAlign: "center", fontSize: "36px", fontWeight: "bold", margin: "0 0 16px 0", letterSpacing: "2px" }}>
        INVOICE
      </h1>
      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: "0 0 24px 0" }} />

      {/* TWO COLUMN: Supplier + Invoice Details */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <p style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "6px" }}>Supplier</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "BrightTech Solutions Ltd"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.phone || "+44 20 7946 0958"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.address || "221B Baker Street, London, NW1 6XE, UK"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.fiscal_code || "GB123456789"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.email || "contact@brighttech.co.uk"}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "6px" }}>Invoice Details</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Invoice No. #{invoice.invoice_number}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Date {formatDate(invoice.date)}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Supply Date: {formatDate(invoice.date)}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Valid Until {formatDate(invoice.due_date)}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Currency {currency}</p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", marginBottom: "8px" }}>
        <thead>
          <tr style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
            <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: "normal", color: "#555", width: "40px" }}>No</th>
            <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: "normal", color: "#555" }}>Item Description</th>
            <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: "normal", color: "#555", width: "110px" }}>Price</th>
            <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: "normal", color: "#555", width: "80px" }}>Quantity</th>
            <th style={{ textAlign: "right", padding: "8px 4px", fontWeight: "normal", color: "#555", width: "110px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: "10px 4px", color: "#1a1a1a" }}>{String(idx + 1).padStart(2, "0")}</td>
              <td style={{ padding: "10px 4px", color: "#1a1a1a" }}>{item.description}</td>
              <td style={{ padding: "10px 4px", color: "#1a1a1a" }}>{(item.unit_price ?? 0).toFixed(2)} {currency}</td>
              <td style={{ padding: "10px 4px", color: "#1a1a1a" }}>{item.quantity ?? 1}</td>
              <td style={{ padding: "10px 4px", textAlign: "right", color: "#1a1a1a" }}>{(item.total ?? 0).toFixed(2)} {currency}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SUMMARY - right aligned */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
        <div style={{ minWidth: "260px" }}>
          <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", marginBottom: "10px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
            <span style={{ color: "#555" }}>Subtotal (excl. VAT)</span>
            <span>{(invoice.subtotal ?? 0).toFixed(2)} {currency}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
            <span style={{ color: "#555" }}>VAT ({b.vat_rate || 20}%)</span>
            <span>{(invoice.tax_amount ?? 0).toFixed(2)} {currency}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "bold", marginTop: "8px" }}>
            <span>Total (incl. VAT)</span>
            <span>{(invoice.total ?? 0).toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: "0 0 20px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "8px" }}>Payment Details</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Bank Transfer</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "BrightTech Solutions Ltd"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.account_number || "12345678"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.sort_code || "12-34-56"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.iban || "GB29NWBK60161331926819"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.bank_name || "Barclays"}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "8px" }}>Customer</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{c.name || "Digital Growth Agency Ltd"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{c.address || "14 King Street, Manchester, M2 6AG, UK"}</p>
          {c.vat && <p style={{ fontSize: "11px", margin: "2px 0" }}>{c.vat}</p>}
        </div>
      </div>

    </div>
  );
};

export default Template1;
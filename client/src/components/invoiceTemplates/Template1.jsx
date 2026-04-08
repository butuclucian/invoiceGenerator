const Template2 = ({ invoice, billingProfile }) => {
  if (!invoice || !billingProfile) return null;

  const b = billingProfile;
  const cl = invoice.client || {};
  const currency = b.currency || "GBP";

  const fmt = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    }).toLowerCase();
  };

  const items = invoice.items || [];

  return (
    <div style={{
      width: "794px",
      minHeight: "1123px",
      backgroundColor: "#F5F2EC",
      padding: "36px 50px",
      fontFamily: "Helvetica, Arial, sans-serif",
      color: "#1a1a1a",
      boxSizing: "border-box",
    }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0, letterSpacing: "1px" }}>invoice</h1>
        <div style={{ textAlign: "right", fontSize: "11px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginBottom: "3px" }}>
            <span style={{ color: "#666" }}>invoice no:</span>
            <span>INV-{invoice.invoice_number}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginBottom: "3px" }}>
            <span style={{ color: "#666" }}>date:</span>
            <span>{fmt(invoice.date)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
            <span style={{ color: "#666" }}>due date:</span>
            <span>{fmt(invoice.due_date)}</span>
          </div>
        </div>
      </div>

      {/* CUSTOMER */}
      <div style={{ marginBottom: "6px" }}>
        <span style={{ fontWeight: "bold", fontSize: "12px", marginRight: "24px" }}>customer</span>
        <span style={{ fontSize: "11px", marginRight: "16px" }}>{cl.name || "Digital Growth Agency Ltd"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.address || "14 King Street, Manchester, M2 6AG, UK"}</span>
        <span style={{ fontSize: "11px", color: "#555" }}>{cl.vat || "GB987654321"}</span>
      </div>
      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: "0 0 14px 0" }} />

      {/* SUPPLIER */}
      <div style={{ marginBottom: "30px" }}>
        <span style={{ fontWeight: "bold", fontSize: "12px", marginRight: "24px" }}>supplier</span>
        <span style={{ fontSize: "11px", marginRight: "16px" }}>{b.business_name || "BrightTech Solutions Ltd"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{b.phone || "+44 20 7946 0958"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{b.address || "221B Baker Street, London"}</span>
        <span style={{ fontSize: "11px", color: "#555" }}>{b.email || "contact@brighttech.co.uk"}</span>
      </div>

      {/* TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", marginBottom: "8px" }}>
        <thead>
          <tr style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
            <th style={{ padding: "7px 4px", textAlign: "left", fontWeight: "normal", color: "#666", width: "36px" }}>no</th>
            <th style={{ padding: "7px 4px", textAlign: "left", fontWeight: "normal", color: "#666" }}>item description</th>
            <th style={{ padding: "7px 4px", textAlign: "left", fontWeight: "normal", color: "#666", width: "110px" }}>price</th>
            <th style={{ padding: "7px 4px", textAlign: "left", fontWeight: "normal", color: "#666", width: "80px" }}>quantity</th>
            <th style={{ padding: "7px 4px", textAlign: "right", fontWeight: "normal", color: "#666", width: "110px" }}>total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: "10px 4px" }}>{String(idx + 1).padStart(2, "0")}</td>
              <td style={{ padding: "10px 4px" }}>{item.description}</td>
              <td style={{ padding: "10px 4px" }}>{(item.unit_price ?? 0).toFixed(2)} {currency}</td>
              <td style={{ padding: "10px 4px" }}>{item.quantity ?? 1}</td>
              <td style={{ padding: "10px 4px", textAlign: "right" }}>{(item.total ?? 0).toFixed(2)} {currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: "0 0 10px 0" }} />

      {/* SUBTOTAL ROW */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "20px" }}>
        <span>subtotal (excl. vat)</span>
        <span style={{ fontWeight: "bold" }}>{(invoice.subtotal ?? 0).toFixed(2)} {currency}</span>
      </div>

      {/* VAT / DISCOUNT / TOTAL */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
        <div style={{ minWidth: "280px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
            <span style={{ color: "#666" }}>vat ({b.vat_rate || 20}%)</span>
            <span>{(invoice.tax_amount ?? 0).toFixed(2)} {currency}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
            <span style={{ color: "#666" }}>discount ({b.discount_rate || 10}%)</span>
            <span>{(invoice.discount_amount ?? 0).toFixed(2)} {currency}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "bold" }}>
            <span>total (incl. VAT)</span>
            <span>{(invoice.total ?? 0).toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontWeight: "bold", fontSize: "13px", marginBottom: "8px" }}>payment options</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Bank Transfer</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "BrightTech Solutions Ltd"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.iban || "GB29NWBK60161331926819"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.bank_name || "Barclays"}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: "11px" }}>
          <p style={{ margin: "2px 0" }}>✉ {b.email || "contact@brighttech.co.uk"}</p>
          <p style={{ margin: "2px 0" }}>⊞ {b.address || "221B Baker Street, London"}</p>
          <p style={{ margin: "2px 0" }}>☎ {b.phone || "+44 20 7946 0958"}</p>
        </div>
      </div>

    </div>
  );
};

export default Template2;
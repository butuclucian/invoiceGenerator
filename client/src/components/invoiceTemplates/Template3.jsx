const Template3 = ({ invoice, billingProfile }) => {
  if (!invoice || !billingProfile) return null;

  const b = billingProfile;
  const cl = invoice.client || {};
  const currency = b.currency || "GBP";

  const fmt = (d) => {
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
      padding: "36px 50px",
      fontFamily: "Helvetica, Arial, sans-serif",
      color: "#1a1a1a",
      boxSizing: "border-box",
      position: "relative",
    }}>

      {/* TOP SECTION: Title left + Black card right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>

        {/* LEFT: Title + invoice number + customer + payment */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "38px", fontWeight: "bold", margin: "0 0 4px 0", letterSpacing: "2px" }}>INVOICE</h1>
          <p style={{ fontSize: "11px", color: "#555", margin: "0 0 20px 0" }}>Invoice No. #{invoice.invoice_number}</p>

          <p style={{ fontWeight: "bold", fontSize: "12px", margin: "0 0 4px 0" }}>Customer</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{cl.name || "Digital Growth Agency Ltd"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{cl.address || "14 King Street, Manchester, M2 6AG, UK"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0 16px 0", color: "#555" }}>{cl.vat || "GB987654321"}</p>

          <p style={{ fontWeight: "bold", fontSize: "12px", margin: "0 0 4px 0" }}>Payment Details</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Bank Transfer</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "BrightTech Solutions Ltd"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.iban || "GB29NWBK60161331926819"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.bank_name || "Barclays"}</p>
        </div>

        {/* RIGHT: Black card with invoice details */}
        <div style={{
          backgroundColor: "#1a1a1a",
          color: "#fff",
          padding: "20px 24px",
          width: "220px",
          flexShrink: 0,
          marginLeft: "32px",
          position: "relative",
        }}>
          {/* Corner brackets */}
          <div style={{ position: "absolute", top: "-6px", left: "-6px", width: "12px", height: "12px", borderTop: "2px solid #1a1a1a", borderLeft: "2px solid #1a1a1a" }} />
          <div style={{ position: "absolute", bottom: "-6px", right: "-6px", width: "12px", height: "12px", borderBottom: "2px solid #1a1a1a", borderRight: "2px solid #1a1a1a" }} />

          <p style={{ fontWeight: "bold", fontSize: "12px", textAlign: "center", marginBottom: "14px", color: "#fff" }}>Invoice Details</p>
          <div style={{ fontSize: "11px", color: "#ddd" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span>Date</span>
              <span style={{ color: "#fff" }}>{fmt(invoice.date)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span>Supply Date</span>
              <span style={{ color: "#fff" }}>{fmt(invoice.date)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span>Valid Until</span>
              <span style={{ color: "#fff" }}>{fmt(invoice.due_date)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Currency</span>
              <span style={{ color: "#fff" }}>{currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE with border */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", border: "1px solid #1a1a1a", marginBottom: "16px" }}>
        <thead>
          <tr style={{ backgroundColor: "#ebebeb" }}>
            <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: "bold", borderRight: "1px solid #1a1a1a", width: "36px" }}>No</th>
            <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: "bold", borderRight: "1px solid #1a1a1a" }}>Item Description</th>
            <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: "bold", borderRight: "1px solid #1a1a1a", width: "110px" }}>Price</th>
            <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: "bold", borderRight: "1px solid #1a1a1a", width: "80px" }}>Quantity</th>
            <th style={{ padding: "8px 8px", textAlign: "right", fontWeight: "bold", width: "110px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} style={{ borderTop: "1px solid #1a1a1a" }}>
              <td style={{ padding: "9px 8px", borderRight: "1px solid #1a1a1a" }}>{String(idx + 1).padStart(2, "0")}</td>
              <td style={{ padding: "9px 8px", borderRight: "1px solid #1a1a1a" }}>{item.description}</td>
              <td style={{ padding: "9px 8px", borderRight: "1px solid #1a1a1a" }}>{(item.unit_price ?? 0).toFixed(2)} {currency}</td>
              <td style={{ padding: "9px 8px", borderRight: "1px solid #1a1a1a" }}>{item.quantity ?? 1}</td>
              <td style={{ padding: "9px 8px", textAlign: "right" }}>{(item.total ?? 0).toFixed(2)} {currency}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SUMMARY */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
        <div style={{ minWidth: "280px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
            <span style={{ color: "#555" }}>Subtotal (excl. VAT)</span>
            <span>{(invoice.subtotal ?? 0).toFixed(2)} {currency}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
            <span style={{ color: "#555" }}>VAT ({b.vat_rate || 20}%)</span>
            <span>{(invoice.tax_amount ?? 0).toFixed(2)} {currency}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "bold" }}>
            <span>Total (incl. VAT)</span>
            <span>{(invoice.total ?? 0).toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>

      {/* SUPPLIER */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "6px" }}>Supplier</p>
        <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "BrightTech Solutions Ltd"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.phone || "+44 20 7946 0958"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.address || "221B Baker Street, London, NW1 6XE, UK"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.email || "contact@brighttech.co.uk"}</p>
      </div>

      {/* BOTTOM BAR */}
      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: "0 0 10px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#555" }}>
        <span>☎ {b.phone || "+44 20 7946 0958"}</span>
        <span>⊞ {b.address || "221B Baker Street, London, NW1 6XE, UK"}</span>
        <span>✉ {b.email || "contact@brighttech.co.uk"}</span>
      </div>

    </div>
  );
};

export default Template3;
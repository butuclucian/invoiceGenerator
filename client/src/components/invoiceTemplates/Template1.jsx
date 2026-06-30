const Template2 = ({ invoice, billingProfile }) => {
  if (!invoice || !billingProfile) return null;

  const b = billingProfile;
  const cl = invoice.client || {};
  const currency = b.currency || "RON";

  const fmt = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    }).toLowerCase();
  };

  const items = invoice.items || [];

  const discountAmount = invoice.discount_rate
    ? (invoice.subtotal * invoice.discount_rate) / 100
    : 0;

  const taxAmount = invoice.tax_rate
    ? ((invoice.subtotal - discountAmount) * invoice.tax_rate) / 100
    : 0;

  return (
    <div style={{width: "794px", minHeight: "1123px", backgroundColor: "#F5F2EC", padding: "36px 50px", fontFamily: "Helvetica, Arial, sans-serif", color: "#1a1a1a", boxSizing: "border-box"}}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0, letterSpacing: "1px" }}>factură</h1>
        <div style={{ textAlign: "right", fontSize: "11px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginBottom: "3px" }}>
            <span style={{ color: "#666" }}>nr factură:</span>
            <span>{invoice.invoice_number}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginBottom: "3px" }}>
            <span style={{ color: "#666" }}>dată:</span>
            <span>{fmt(invoice.date)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
            <span style={{ color: "#666" }}>dată scadentă:</span>
            <span>{fmt(invoice.due_date)}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "6px" }}>
        <span style={{ fontWeight: "bold", fontSize: "12px", marginRight: "24px" }}>client</span>
        <span style={{ fontSize: "11px", marginRight: "16px" }}>{cl.brand || "brand indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.cui || "cui indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.reg_com || "reg.com indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.address || "adresă indisponibilă"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.city || "oraș indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.country || "țară indisponibilă"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.iban || "iban indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.bank || "nume bancă indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.contact_person || "persoană de contact indisponibilă"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{cl.email || "email indisponibil"}</span>

      </div>
      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: "0 0 14px 0" }} />

      <div style={{ marginBottom: "30px" }}>
        <span style={{ fontWeight: "bold", fontSize: "12px", marginRight: "24px" }}>furnizor</span>
        <span style={{ fontSize: "11px", marginRight: "16px" }}>{b.business_name || "Nume firmă indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{b.email || "Email indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{b.cif || "Cif indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{b.registration_number || "Reg.Com indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{b.address || "Adresă indisponibilă"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{b.country || "Țară indisponibil"}</span>
        <span style={{ fontSize: "11px", marginRight: "16px", color: "#555" }}>{b.iban || "Iban indisponibi"}</span>
        <span style={{ fontSize: "11px", color: "#555" }}>{b.bank || "Nume bancă indisponibil"}</span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", marginBottom: "8px" }}>
        <thead>
          <tr style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
            <th style={{ padding: "7px 4px", textAlign: "left", fontWeight: "normal", color: "#666", width: "36px" }}>nr</th>
            <th style={{ padding: "7px 4px", textAlign: "left", fontWeight: "normal", color: "#666" }}>descriere</th>
            <th style={{ padding: "7px 4px", textAlign: "left", fontWeight: "normal", color: "#666", width: "110px" }}>preț</th>
            <th style={{ padding: "7px 4px", textAlign: "left", fontWeight: "normal", color: "#666", width: "80px" }}>cantitate</th>
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

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "20px" }}>
        <span>subtotal (fără. tva)</span>
        <span style={{ fontWeight: "bold" }}>{(invoice.subtotal ?? 0).toFixed(2)} {currency}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
        <div style={{ minWidth: "280px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
            <span style={{ color: "#666" }}>tva ({invoice.tax_rate || 19}%)</span>
             <span>+{taxAmount.toFixed(2)} RON</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
            <span style={{ color: "#666" }}>reducere ({invoice.discount_rate || 0}%)</span>
            <span>-{discountAmount.toFixed(2)} RON</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "bold" }}>
            <span>total (incl. tva)</span>
            <span>{(invoice.total ?? 0).toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontWeight: "bold", fontSize: "13px", marginBottom: "8px" }}>opțiune de plată</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Transfer Bancar</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "Nume firmă indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.iban || "Iban indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.bank_name || "Nume bancă indisponibil"}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: "11px" }}>
          <p style={{ margin: "2px 0" }}>{b.email || "indisponibil"}</p>
          <p style={{ margin: "2px 0" }}>{b.address || "indisponibil"}</p>
          <p style={{ margin: "2px 0" }}>{b.phone || "indisponibil"}</p>
        </div>
      </div>

    </div>
  );
};

export default Template2;
const Template3 = ({ invoice, billingProfile }) => {
  if (!invoice || !billingProfile) return null;

  const b = billingProfile;
  const cl = invoice.client || {};
  const currency = b.currency || "RON";

  const fmt = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const items = invoice.items || [];

  const discountAmount = invoice.discount_rate
    ? (invoice.subtotal * invoice.discount_rate) / 100
    : 0;

  const taxAmount = invoice.tax_rate
    ? ((invoice.subtotal - discountAmount) * invoice.tax_rate) / 100
    : 0;

  return (
    <div style={{width: "794px", minHeight: "1123px", backgroundColor: "#F5F2EC", padding: "36px 50px", fontFamily: "Helvetica, Arial, sans-serif", color: "#1a1a1a", boxSizing: "border-box", position: "relative"}}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "38px", fontWeight: "bold", margin: "0 0 4px 0", letterSpacing: "2px" }}>FACTURĂ</h1>
          <p style={{ fontSize: "11px", color: "#555", margin: "0 0 20px 0" }}>Nr. Factură #{invoice.invoice_number}</p>

          <p style={{ fontWeight: "bold", fontSize: "12px", margin: "0 0 4px 0" }}>Client</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{cl.brand || "brand indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{cl.cui || "cui indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{cl.reg_com || "reg.com indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{cl.address || "adresă indisponibilă"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{cl.city || "oraș indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{cl.country || "țară indisponibilă"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{cl.iban || "iban indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{cl.bank || "nume bancă indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{cl.contact_person || "persoană de contact indisponibilă"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0 16px 0", color: "#555" }}>{cl.email || "email indisponibil"}</p>

          <p style={{ fontWeight: "bold", fontSize: "12px", margin: "0 0 4px 0" }}>opțiune de plată</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Transfer Bancar</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "Nume firmă indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.iban || "Iban indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.bank_name || "Nume bancă indisponibil"}</p>
        </div>

        <div style={{backgroundColor: "#1a1a1a", color: "#fff", padding: "20px 24px", width: "220px", flexShrink: 0, marginLeft: "32px", position: "relative"}}>
          <div style={{ position: "absolute", top: "-6px", left: "-6px", width: "12px", height: "12px", borderTop: "2px solid #1a1a1a", borderLeft: "2px solid #1a1a1a" }} />
          <div style={{ position: "absolute", bottom: "-6px", right: "-6px", width: "12px", height: "12px", borderBottom: "2px solid #1a1a1a", borderRight: "2px solid #1a1a1a" }} />

          <p style={{ fontWeight: "bold", fontSize: "12px", textAlign: "center", marginBottom: "14px", color: "#fff" }}>Detalii Factură</p>
          <div style={{ fontSize: "11px", color: "#ddd" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span>Dată</span>
              <span style={{ color: "#fff" }}>{fmt(invoice.date)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span>dată scadentă:</span>
              <span style={{ color: "#fff" }}>{fmt(invoice.due_date)}</span>
            </div>
          </div>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", border: "1px solid #1a1a1a", marginBottom: "16px" }}>
        <thead>
          <tr style={{ backgroundColor: "#ebebeb" }}>
            <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: "bold", borderRight: "1px solid #1a1a1a", width: "36px" }}>Nr</th>
            <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: "bold", borderRight: "1px solid #1a1a1a" }}>Descriere</th>
            <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: "bold", borderRight: "1px solid #1a1a1a", width: "110px" }}>Preț</th>
            <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: "bold", borderRight: "1px solid #1a1a1a", width: "80px" }}>Cantitate</th>
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

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
        <div style={{ minWidth: "280px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
            <span style={{ color: "#555" }}>Subtotal (fără TVA)</span>
            <span>{(invoice.subtotal ?? 0).toFixed(2)} {currency}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
            <span style={{ color: "#555" }}>TVA ({invoice.tax_rate || 19}%)</span>
            <span>+{taxAmount.toFixed(2)} RON</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
            <span style={{ color: "#555" }}>Reducere ({invoice.discount_rate || 0}%)</span>
            <span>-{discountAmount.toFixed(2)} RON</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "bold" }}>
            <span>Total (incl. TVA)</span>
            <span>{(invoice.total ?? 0).toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "6px" }}>Furnizor</p>
        <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "Nume firmă indisponibil"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.email || "Email indisponibil"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.cif || "Cif indisponibil"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.registration_number || "Reg.Com indisponibil"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.address || "Adresă indisponibilă"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.country || "Țară indisponibil"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.iban || "Iban indisponibi"}</p>
        <p style={{ fontSize: "11px", margin: "2px 0", color: "#555" }}>{b.bank || "Nume bancă indisponibil"}</p>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: "0 0 10px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#555" }}>
        <span>{b.email || "indisponibil"}</span>
        <span>{b.address || "indisponibil"}</span>
        <span>{b.phone || "indisponibil"}</span>
      </div>

    </div>
  );
};

export default Template3;
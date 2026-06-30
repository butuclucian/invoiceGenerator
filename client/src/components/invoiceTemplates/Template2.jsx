const Template1 = ({ invoice, billingProfile }) => {
  if (!invoice || !billingProfile) return null;

  const b = billingProfile;
  const c = invoice.client || {};
  const currency = b.currency || "RON";

  const formatDate = (d) => {
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
    <div style={{ width: "794px", minHeight: "1123px", backgroundColor: "#F5F2EC", padding: "40px 50px", fontFamily: "Helvetica, Arial, sans-serif", color: "#1a1a1a", boxSizing: "border-box", position: "relative"}}>

      <h1 style={{ textAlign: "center", fontSize: "36px", fontWeight: "bold", margin: "0 0 16px 0", letterSpacing: "2px" }}>
        FACTURĂ
      </h1>
      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: "0 0 24px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <p style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "6px" }}>Furnizor</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "Nume firmă indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.email || "Email indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.cif || "Cif indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.registration_number || "Reg.Com indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.address || "Adresă indisponibilă"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.country || "Țară indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.iban || "Iban indisponibi"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.bank || "Nume bancă indisponibil"}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "6px" }}>Detalii Factură</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Nr. Factură {invoice.invoice_number}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Dată {formatDate(invoice.date)}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Dată Scadentă {formatDate(invoice.due_date)}</p>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", marginBottom: "8px" }}>
        <thead>
          <tr style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
            <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: "normal", color: "#555", width: "40px" }}>Nr</th>
            <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: "normal", color: "#555" }}>Descriere</th>
            <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: "normal", color: "#555", width: "110px" }}>Preț</th>
            <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: "normal", color: "#555", width: "80px" }}>Cantitate</th>
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

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
        <div style={{ minWidth: "260px" }}>
          <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", marginBottom: "10px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
            <span style={{ color: "#555" }}>Subtotal (fără TVA)</span>
            <span>{(invoice.subtotal ?? 0).toFixed(2)} {currency}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
            <span style={{ color: "#555" }}>TVA ({invoice.tax_rate || 19}%)</span>
            <span>+{taxAmount.toFixed(2)} RON</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginTop: "6px" }}>
            <span style={{ color: "#555" }}>Reducere ({invoice.discount_rate || 0}%)</span>
            <span>-{discountAmount.toFixed(2)} RON</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "bold", marginTop: "8px" }}>
            <span>Total (incl. TVA)</span>
            <span>{(invoice.total ?? 0).toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: "0 0 20px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "8px" }}>Opțiuni de Plată</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>Transfer Bancar</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.business_name || "Nume firmă indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.iban || "Iban indisponibil"}</p>
          <p style={{ fontSize: "11px", margin: "2px 0" }}>{b.bank_name || "Nume bancă indisponibil"}</p>
        </div>
        <div style={{ textAlign: "right" }}>
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
      </div>

    </div>
  );
};

export default Template1;
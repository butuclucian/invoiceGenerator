import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Dashboard from "./pages/Admin/Dashboard";
import Invoices from "./pages/Admin/Invoices";
import CreateInvoice from "./pages/Admin/CreateInvoice";
import RecurringInvoice from "./pages/Admin/RecurringInvoice";
import Accounting from "./pages/Admin/Accounting";
import Reports from "./pages/Admin/Reports";
import AddClients from "./pages/Admin/AddClients";
import Clients from "./pages/Admin/Clients";
import AIGenerator from "./pages/Admin/AIGenerator";
import EditInvoice from "./pages/Admin/EditInvoice";
import InvoicePreview from "./pages/Admin/InvoicePreview";

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // efect scurt (0.5s)
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      {loading && <Loader />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Invoices />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/create" element={<CreateInvoice />} />
          <Route path="invoices/recurring" element={<RecurringInvoice />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="reports" element={<Reports />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/add" element={<AddClients />} />
          <Route path="ai-generator" element={<AIGenerator />} />
          <Route path="invoices/:id/edit" element={<EditInvoice />} />
          <Route path="invoices/:id" element={<InvoicePreview />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

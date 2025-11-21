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


// 🆕 noile pagini de autentificare
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { Toaster } from "sonner";
import EditClient from "./pages/Admin/EditClient";
import MySubscription from "./pages/Admin/MySubscription";
import Billing from "./pages/Admin/Billing";
import Settings from "./pages/Admin/Settings";
import CalendarPage from "./pages/Admin/CalendarPage";

import About from "./pages/Legal/About";
import Contact from "./pages/Legal/Contact";
import Terms from "./pages/Legal/Terms";
import Privacy from "./pages/Legal/Privacy";
import Careers from "./pages/Legal/Careers";
import Pricing from "./pages/Legal/Pricing";
import EULA from "./pages/Legal/EULA";
import DataProcessingAgreement from "./pages/Legal/DataProcessingAgreement";
import CookiePolicy from "./pages/Legal/Cookies";
import Blog from "./pages/Legal/Blog";

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <Toaster />
      <ScrollToTop />
      {loading && <Loader />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Legal */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/dpa" element={<DataProcessingAgreement />} />
        <Route path="/eula" element={<EULA />} />


        {/* Protected admin routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Invoices />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/create" element={<CreateInvoice />} />
          <Route path="invoices/recurring" element={<RecurringInvoice />} />
          <Route path="invoices/:id/edit" element={<EditInvoice />} />
          <Route path="invoices/:id" element={<InvoicePreview />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/add" element={<AddClients />} />
          <Route path="clients/:id/edit" element={<EditClient />}/>
          <Route path="accounting" element={<Accounting />} />
          <Route path="reports" element={<Reports />} />
          <Route path="ai-generator" element={<AIGenerator />} />
          <Route path="subscription" element={<MySubscription/>}/>
          <Route path="billing" element={<Billing />} />
          <Route path="calendar" element={<CalendarPage />}/>
          <Route path="settings" element={<Settings />}/>

        </Route>
      </Routes>
    </>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { User as UserIcon, Trash2, Save, Loader2, Eye, EyeOff, ShieldCheck, SaveIcon, Building2 } from "lucide-react";
import API from "../../utils/api";
import { toast } from "sonner";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [billing, setBilling] = useState({
    business_name: "",
    cif: "",
    registration_number: "",
    address: "",
    iban: "",
    bank: "",
    phone: "",
    email: "",
    logo: "",
  });


  // Password State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");

      try {
        const userRes = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const billingRes = await API.get("/billing-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          name: userRes.data.name || "",
          email: userRes.data.email || "",
        });

        if (billingRes.data) {
          setBilling((prev) => ({
            ...prev,
            ...billingRes.data,
          }));
        }
      } catch (err) {
        console.error("Load settings error:", err);
        toast.error("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Salvare profil general (Nume și Email)
  const handleProfileSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await API.put(
        "/auth/update",
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profile details updated!");
    } catch (err) {
      toast.error("Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  // Salvare profil de facturare complet (Sincronizat cu backend/Mongoose)
  const handleBillingSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.put("/billing-profile", billing, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Billing profile updated!");
    } catch (err) {
      toast.error("Failed to update billing profile.");
    }
  };

  // Schimbare parolă
  const handlePasswordUpdate = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all password fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    try {
      await API.put("/auth/password", { oldPassword, newPassword });
      toast.success("Password updated!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    }
  };

  // Ștergere cont
  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete("/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      toast.error("Failed to delete account.");
    }
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white">
        <Loader2 size={30} className="animate-spin text-[#80FFF9]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <ShieldCheck className="text-[#80FFF9]" size={26} />
            Settings
          </h1>
          <p className="text-gray-400 text-sm">Account & company data management</p>
        </div>

        {/* 1. SECȚIUNEA PROFIL UTILIZATOR */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4">
            <UserIcon size={18} className="text-[#80FFF9]" />
            User Profile Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/50"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/50"
              />
            </div>
          </div>

          <button
            onClick={handleProfileSave}
            disabled={saving}
            className="mt-5 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Profile Info
          </button>
        </div>

        {/* 2. SECȚIUNEA COMPANIE / BILLING (MAPPED PERFECTLY TO CLEAN MONGOOSE SCHEMA) */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4">
            <Building2 size={18} className="text-[#80FFF9]" /> Billing Profile (Freelancer / PFA Details)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Legal Name */}
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm">Business / Legal Name (ex: Popescu Ion PFA)</label>
              <input
                type="text"
                value={billing.business_name}
                onChange={(e) => setBilling({ ...billing, business_name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"
              />
            </div>

            {/* CIF */}
            <div>
              <label className="text-gray-400 text-sm">CIF / CUI / Fiscal ID</label>
              <input
                type="text"
                placeholder="ex: 12345678 sau RO12345678"
                value={billing.cif}
                onChange={(e) => setBilling({ ...billing, cif: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"
              />
            </div>

            {/* Registration Number */}
            <div className="md:col-span-1">
              <label className="text-gray-400 text-sm">Trade Registry No. (Reg. Com.)</label>
              <input
                type="text"
                placeholder="ex: F35/123/2026 (sau gol pfi)"
                value={billing.registration_number}
                onChange={(e) => setBilling({ ...billing, registration_number: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-400 text-sm">Billing Phone</label>
              <input
                type="text"
                value={billing.phone}
                onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"
              />
            </div>

            {/* Billing Email */}
            <div>
              <label className="text-gray-400 text-sm">Billing Email</label>
              <input
                type="email"
                value={billing.email}
                onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"
              />
            </div>

            {/* Headquarters Address */}
            <div className="md:col-span-3">
              <label className="text-gray-400 text-sm">Full Headquarters Address (Include City, County)</label>
              <input
                type="text"
                placeholder="ex: Str. Inovației, Nr. 10, Timișoara, Timiș"
                value={billing.address}
                onChange={(e) => setBilling({ ...billing, address: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"
              />
            </div>

            {/* IBAN */}
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm">IBAN Account</label>
              <input
                type="text"
                value={billing.iban}
                onChange={(e) => setBilling({ ...billing, iban: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 uppercase focus:outline-none focus:border-[#80FFF9]/30"
              />
            </div>

            {/* Bank */}
            <div>
              <label className="text-gray-400 text-sm">Bank Name</label>
              <input
                type="text"
                value={billing.bank}
                onChange={(e) => setBilling({ ...billing, bank: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"
              />
            </div>

            {/* Logo URL */}
            <div className="md:col-span-3">
              <label className="text-gray-400 text-sm">Invoice Logo URL</label>
              <input
                type="text"
                placeholder="https://example.com/logo.png"
                value={billing.logo}
                onChange={(e) => setBilling({ ...billing, logo: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"
              />
              {billing.logo && (
                <img src={billing.logo} alt="Logo Preview" className="w-20 h-20 rounded-lg object-contain mt-3 border border-white/10" />
              )}
            </div>
          </div>

          <button
            onClick={handleBillingSave}
            className="mt-5 px-4 py-2 rounded-xl bg-[#80FFF9]/20 border border-[#80FFF9]/40 hover:bg-[#80FFF9]/30 transition flex items-center gap-2"
          >
            <SaveIcon size={18} className="text-[#80FFF9]" />
            Save Billing Info
          </button>
        </div>

        {/* 3. SECȚIUNEA SCHIMBARE PAROLĂ */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#80FFF9]" />
            Change Password
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-gray-400 text-sm">Old Password</label>
              <input
                type={showPass.old ? "text" : "password"}
                value={passwordForm.oldPassword}
                placeholder="Enter old password..."
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPass({ ...showPass, old: !showPass.old })}
                className="absolute right-3 top-9 text-gray-400 hover:text-white"
              >
                {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label className="text-gray-400 text-sm">New Password</label>
              <input
                type={showPass.new ? "text" : "password"}
                value={passwordForm.newPassword}
                placeholder="Enter new password..."
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                className="absolute right-3 top-9 text-gray-400 hover:text-white"
              >
                {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    calculateStrength(passwordForm.newPassword) <= 1
                      ? "bg-red-500"
                      : calculateStrength(passwordForm.newPassword) <= 3
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${(calculateStrength(passwordForm.newPassword) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-gray-400 text-sm">Confirm New Password</label>
              <input
                type={showPass.confirm ? "text" : "password"}
                value={passwordForm.confirmPassword}
                placeholder="Confirm new password..."
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                className="absolute right-3 top-9 text-gray-400 hover:text-white"
              >
                {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordUpdate}
            className="mt-5 px-4 py-2 rounded-xl bg-[#80FFF9]/20 border border-[#80FFF9]/40 hover:bg-[#80FFF9]/30 transition flex items-center gap-2"
          >
            <SaveIcon size={18} className="text-[#80FFF9]" />
            Update Password
          </button>
        </div>

        {/* SECȚIUNEA PERICULOASĂ: STERGERE CONT */}
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/10 transition w-full sm:w-auto"
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
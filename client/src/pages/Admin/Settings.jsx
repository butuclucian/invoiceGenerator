import React, { useEffect, useState } from "react";
import { User, Bell, Moon, Trash2, Save, Palette, Loader2, Eye, EyeOff, ShieldCheck, SaveIcon,} from "lucide-react";
import API from "../../utils/api";
import { toast } from "sonner";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Billing Profile (company data)
  const [billing, setBilling] = useState({
      business_name: "",
      fiscal_code: "",
      address: "",
      phone: "",
      email: "",
      bank: "",
      iban: "",
      vat_rate: 19,
      currency: "RON",
      logo: "",
    });


  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [settings, setSettings] = useState({
    theme: "dark",
    accentColor: "#80FFF9",
    sidebarBehavior: "fixed",
    density: "normal",
    emailNotifications: true,
    notifyInvoicePaid: true,
    notifyInvoiceOverdue: true,
    notifyAIInvoice: true,
    notificationFrequency: "instant",
    aiTone: "friendly",
    aiLength: "normal",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
  const loadData = async () => {
    const token = localStorage.getItem("token");

    try {
      const userRes = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const settingsRes = await API.get("/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const billingRes = await API.get("/billing-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Set general profile info
      setProfile({
        name: userRes.data.name || "",
        email: userRes.data.email || "",
      });

      // Set UI settings
      if (settingsRes.data) {
        setSettings(settingsRes.data);
      }

      // Set billing data only if exists
      if (billingRes.data) {
        setBilling(prev => ({
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



  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await API.put(
        "/auth/update",
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await API.put("/settings", settings, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Settings saved!");
    } catch (err) {
      toast.error("Save failed.");
    } finally {
      setSaving(false);
    }
  };

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

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    }
  };

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


  const handleDelete = async () => {
  if (!window.confirm("Are you sure? This cannot be undone.")) return;

  try {
    const token = localStorage.getItem("token");
    await API.delete("/delete-account", {
      headers: { Authorization: `Bearer ${token}` }
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

  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });

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
          <p className="text-gray-400 text-sm">
            Account & application preferences
          </p>
        </div>

        {/* User profile */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4">
            <User size={18} className="text-[#80FFF9]" />
            Profile
          </h2>

          {/* user details - name and address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* user name */}
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <input type="text" value={profile.name} onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"
              />
            </div>

            {/* email address */}
            <div>
              <label className="text-gray-400 text-sm">Email Address</label>
              <input type="email" value={profile.email} onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"
              />
            </div>

          </div>

        </div>

        {/* billing profile */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4">
            <Moon size={18} className="text-[#80FFF9]" /> Billing Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Name */}
            <div>
              <label className="text-gray-400 text-sm">Business / Legal Name</label>
              <input type="text" value={billing.business_name} onChange={(e) => setBilling({ ...billing, business_name: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" />
            </div>

            {/* Fiscal Code */}
            <div>
              <label className="text-gray-400 text-sm">CIF / Fiscal ID</label>
              <input type="text" value={billing.fiscal_code} onChange={(e) => setBilling({ ...billing, fiscal_code: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" />
            </div>

            {/* Address */}
            <div>
              <label className="text-gray-400 text-sm">Address</label>
              <input type="text" value={billing.address} onChange={(e) => setBilling({ ...billing, address: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" />
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-400 text-sm">Phone</label>
              <input type="text" value={billing.phone} onChange={(e) => setBilling({ ...billing, phone: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" />
            </div>

            {/* Billing Email */}
            <div>
              <label className="text-gray-400 text-sm">Billing Email</label>
              <input type="email" value={billing.email} onChange={(e) => setBilling({ ...billing, email: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" />
            </div>

            {/* Bank */}
            <div>
              <label className="text-gray-400 text-sm">Bank</label>
              <input type="text" value={billing.bank} onChange={(e) => setBilling({ ...billing, bank: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" />
            </div>

            {/* IBAN */}
            <div>
              <label className="text-gray-400 text-sm">IBAN</label>
              <input type="text" value={billing.iban} onChange={(e) => setBilling({ ...billing, iban: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"
              />
            </div>

            {/* VAT Rate */}
            <div>
              <label className="text-gray-400 text-sm">VAT Rate (%)</label>
              <input type="number" value={billing.vat_rate} onChange={(e) => setBilling({ ...billing, vat_rate: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" />
            </div>

            {/* Currency */}
            <div>
              <label className="text-gray-400 text-sm">Currency</label>
              <select value={billing.currency} onChange={(e) => setBilling({ ...billing, currency: e.target.value })} className="cursor-pointer w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" >
                <option value="RON">RON</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Logo URL */}
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm">Company Logo URL</label>
              <input type="text" placeholder="https://example.com/logo.png" value={billing.logo} onChange={(e) => setBilling({ ...billing, logo: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" />
              {billing.logo && (
                <img src={billing.logo} alt="Logo Preview" className="w-20 h-20 rounded-lg object-contain mt-3 border border-white/10" />
              )}
            </div>

          </div>

          <button onClick={handleBillingSave} className="mt-5 px-4 py-2 rounded-xl bg-[#80FFF9]/20 border border-[#80FFF9]/40 hover:bg-[#80FFF9]/30 transition flex items-center gap-2" >
            <SaveIcon size={18} className="text-[#80FFF9]" />
            Save Billing Info
          </button>
        </div>

        {/* change password form */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#80FFF9]" />
            Change Password
          </h2>

          {/* old pass - new pass - confirm new pass */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* old pass */}
            <div className="relative">

              <label className="text-gray-400 text-sm">Old Password</label>
              <input type={showPass.old ? "text" : "password"} value={passwordForm.oldPassword} placeholder="Enter old password..." onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value }) } className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"/>
              <button type="button" onClick={() => setShowPass({ ...showPass, old: !showPass.old }) } className="absolute right-3 top-9 text-gray-400 hover:text-white">
                {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            
            </div>

            {/* new pass */}
            <div className="relative">
              <label className="text-gray-400 text-sm">New Password</label>
              <input type={showPass.new ? "text" : "password"} value={passwordForm.newPassword} placeholder="Enter new password..." onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value }) } className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"/>
              <button type="button" onClick={() => setShowPass({ ...showPass, new: !showPass.new }) } className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" >
                {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {/* pass strong */}
              <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${
                    calculateStrength(passwordForm.newPassword) <= 1
                      ? "bg-red-500"
                      : calculateStrength(passwordForm.newPassword) <= 3
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${ (calculateStrength(passwordForm.newPassword) / 5) * 100 }%`,}}
                />
              </div>

            </div>

            {/* confirm pass */}
            <div className="relative">
              <label className="text-gray-400 text-sm">Confirm New Password</label>
              <input type={showPass.confirm ? "text" : "password"} value={passwordForm.confirmPassword} placeholder="Confirm new password..." onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value, }) } className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"/>
              <button type="button" onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm }) } className="absolute right-3 top-9 text-gray-400 hover:text-white">
                {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

          </div>

          {/*update pass button */}
          <button onClick={handlePasswordUpdate} className="mt-5 px-4 py-2 rounded-xl bg-[#80FFF9]/20 border border-[#80FFF9]/40 hover:bg-[#80FFF9]/30 transition flex items-center gap-2">
            <SaveIcon size={18} className="text-[#80FFF9]" />
            Update Password
          </button>

        </div>

        {/* ui settings */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4">
            <Palette size={18} className="text-[#CB52D4]" /> UI Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Theme</label>
              <select value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value }) } className="cursor-pointer w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Accent Color</label>
              <input type="color" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value }) } className="w-full h-10 bg-transparent rounded-md mt-1 cursor-pointer"/>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Sidebar Behavior</label>
              <select value={settings.sidebarBehavior} onChange={(e) => setSettings({ ...settings, sidebarBehavior: e.target.value }) } className="cursor-pointer w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200" >
                <option value="fixed">Fixed</option>
                <option value="floating">Floating</option>
                <option value="auto-hide">Auto Hide</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Information Density</label>
              <select value={settings.density} onChange={(e) => setSettings({ ...settings, density: e.target.value }) } className="cursor-pointer w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200">
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

          </div>
        </div>

        {/* notifiations settings */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4">
            <Bell size={18} className="text-yellow-400" /> Notifications
          </h2>

          <div className="flex flex-col gap-3">
            {[
              ["emailNotifications", "Email notifications"],
              ["notifyInvoicePaid", "Notify when invoice is paid"],
              ["notifyInvoiceOverdue", "Notify when invoice becomes overdue"],
              ["notifyAIInvoice", "Notify when AI generates invoice"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.checked }) } className="w-5 h-5 accent-[#80FFF9]"/>
                <span className="text-gray-300">{label}</span>
              </label>
            ))}

            {/* notif freq */}
            <div>
              <label className="text-gray-400 text-sm">Notification Frequency</label>
              <select value={settings.notificationFrequency} onChange={(e) => setSettings({ ...settings, notificationFrequency: e.target.value, }) } className="cursor-pointer w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-2 text-gray-200">
                <option value="instant">Instant</option>
                <option value="hourly">Hourly Summary</option>
                <option value="daily">Daily Digest</option>
              </select>
            </div>

          </div>

        </div>

        {/* ai preferences */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4">
            <Moon size={18} className="text-[#80FFF9]" /> AI Preferences
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ai tone */}
            <div>
              <label className="text-gray-400 text-sm">AI Tone</label>
              <select value={settings.aiTone} onChange={(e) => setSettings({ ...settings, aiTone: e.target.value }) } className="cursor-pointer w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200">
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="brief">Very Brief</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
            {/* ai length */}
            <div>
              <label className="text-gray-400 text-sm">Response Length</label>
              <select value={settings.aiLength} onChange={(e) => setSettings({ ...settings, aiLength: e.target.value }) } className="cursor-pointer w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200">
                <option value="short">Short</option>
                <option value="normal">Normal</option>
                <option value="long">Long</option>
              </select>
            </div>

          </div>
        </div>



        {/* buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition flex items-center gap-2 justify-center" >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>

          <button onClick={handleDelete} className="flex items-center justify-center gap-2 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/10 transition" >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;

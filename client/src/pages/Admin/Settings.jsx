import React, { useEffect, useState } from "react";
import { User, Bell, Moon, Trash2, Save, ShieldCheck, Palette, Loader2, Eye, EyeOff,} from "lucide-react";
import API from "../../utils/api";
import { toast } from "sonner";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =============================
  // USER PROFILE
  // =============================
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // =============================
  // APP SETTINGS
  // =============================
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

  // =============================
  // PASSWORD FORM
  // =============================
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =============================
  // FETCH USER + SETTINGS
  // =============================
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        const userRes = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const settingsRes = await API.get("/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          name: userRes.data.name,
          email: userRes.data.email,
        });

        setSettings(settingsRes.data);
      } catch (err) {
        console.error("Load error:", err);
        toast.error("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // =============================
  // SAVE ALL CHANGES
  // =============================
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      // Save name + email
      await API.put(
        "/auth/update",
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save app settings
      await API.put("/settings", settings, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Settings saved!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // =============================
  // UPDATE PASSWORD
  // =============================
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

  // =============================
  // DELETE ACCOUNT
  // =============================
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete("/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted.");
      localStorage.removeItem("token");
      window.location.href = "/register";
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete account.");
    }
  };


  // =============================
  // PASSWORD STRENGTH METER
  // =============================
  const calculateStrength = (pwd) => {
    let score = 0;

    if (!pwd) return 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    return score; // max 5
  };

  // For show/hide password fields
  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });


  // =============================
  // LOADING SCREEN
  // =============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white">
        <Loader2 size={30} className="animate-spin text-[#80FFF9]" />
      </div>
    );
  }

  // =====================================================
  //               PAGE CONTENT
  // =====================================================
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-10">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <ShieldCheck className="text-[#80FFF9]" size={26} />
            Settings
          </h1>
          <p className="text-gray-400 text-sm">Account & application preferences</p>
        </div>

        {/* PROFILE */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <User size={18} className="text-[#80FFF9]" /> Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"/>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Email Address</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"/>
            </div>
          </div>
        </div>

        {/* ===== CHANGE PASSWORD ===== */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-6 shadow-lg shadow-indigo-900/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#80FFF9]" />
            Change Password
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            {/* OLD PASSWORD */}
            <div className="relative">
              <label className="text-gray-400 text-sm">Old Password</label>
              <input
                type={showPass.old ? "text" : "password"}
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
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

            {/* NEW PASSWORD */}
            <div className="relative">
              <label className="text-gray-400 text-sm">New Password</label>
              <input
                type={showPass.new ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {/* STRENGTH METER */}
              <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    calculateStrength(passwordForm.newPassword) <= 1
                      ? "bg-red-500"
                      : calculateStrength(passwordForm.newPassword) <= 3
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${(calculateStrength(passwordForm.newPassword) / 5) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <label className="text-gray-400 text-sm">Confirm New Password</label>
              <input
                type={showPass.confirm ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
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
            <ShieldCheck size={18} className="text-[#80FFF9]" />
            Update Password
          </button>
        </div>


        {/* UI SETTINGS */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Palette size={18} className="text-[#CB52D4]" /> UI Preferences
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-gray-400 text-sm">Theme</label>
              <select value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Accent Color</label>
              <input type="color" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="w-full h-10 bg-transparent rounded-md mt-1 cursor-pointer"/>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Sidebar Behavior</label>
              <select value={settings.sidebarBehavior} onChange={(e) => setSettings({ ...settings, sidebarBehavior: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200">
                <option value="fixed">Fixed</option>
                <option value="floating">Floating</option>
                <option value="auto-hide">Auto Hide</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Information Density</label>
              <select value={settings.density} onChange={(e) => setSettings({ ...settings, density: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200">
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

          </div>
        </div>

        
        {/* NOTIFICATIONS */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
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
                <input type="checkbox" checked={settings[key]} onChange={(e) =>
                    setSettings({ ...settings, [key]: e.target.checked })
                  }
                  className="w-5 h-5 accent-[#80FFF9]"
                />
                <span className="text-gray-300">{label}</span>
              </label>
            ))}

            <div>
              <label className="text-gray-400 text-sm">Notification Frequency</label>
              <select
                value={settings.notificationFrequency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationFrequency: e.target.value,
                  })
                }
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-2 text-gray-200"
              >
                <option value="instant">Instant</option>
                <option value="hourly">Hourly Summary</option>
                <option value="daily">Daily Digest</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI SETTINGS */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Moon size={18} className="text-[#80FFF9]" /> AI Preferences
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-gray-400 text-sm">AI Tone</label>
              <select value={settings.aiTone} onChange={(e) => setSettings({ ...settings, aiTone: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200">
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="brief">Very Brief</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Response Length</label>
              <select value={settings.aiLength} onChange={(e) => setSettings({ ...settings, aiLength: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200">
                <option value="short">Short</option>
                <option value="normal">Normal</option>
                <option value="long">Long</option>
              </select>
            </div>

          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>

          <button onClick={handleDelete} className="flex items-center gap-2 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/10 transition">
            <Trash2 size={18} /> Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;

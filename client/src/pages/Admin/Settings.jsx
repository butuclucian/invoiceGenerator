import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Bell,
  Moon,
  Trash2,
  Save,
  ShieldCheck,
  Loader2,
  Palette,
  Settings2,
  SlidersHorizontal,
  Brain,
} from "lucide-react";
import API from "../../utils/api";
import { toast } from "sonner";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);

  // Load BOTH: user + settings
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        const userRes = await API.get("/auth/profile");
        const settingsRes = await API.get("/settings");

        setUser(userRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const saveAll = async () => {
    try {
      setSaving(true);
      await API.put("/settings", settings);
      toast.success("Settings saved!");
    } catch (err) {
      toast.error("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await API.delete("/auth/delete");
      localStorage.removeItem("token");
      toast.success("Account deleted.");
      window.location.href = "/register";
    } catch {
      toast.error("Delete failed.");
    }
  };

  if (loading || !settings)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-[#80FFF9]" size={30} />
      </div>
    );

  const update = (field, value) =>
    setSettings((p) => ({ ...p, [field]: value }));

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-10">
      <h1 className="text-3xl font-semibold flex items-center gap-2 mb-10">
        <ShieldCheck className="text-[#80FFF9]" /> Settings
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* --- UI SETTINGS --- */}
        <div className="p-6 bg-[#111]/80 border border-white/10 rounded-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Palette className="text-[#80FFF9]" /> Appearance
          </h2>

          {/* THEME */}
          <label className="block mb-4">
            <span className="text-sm text-gray-400">Theme</span>
            <select
              value={settings.theme}
              onChange={(e) => update("theme", e.target.value)}
              className="mt-1 bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 w-full"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </label>

          {/* ACCENT COLOR */}
          <label className="flex items-center gap-3 mt-4">
            <span className="text-sm text-gray-400">Accent Color</span>
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => update("accentColor", e.target.value)}
              className="w-10 h-10 rounded"
            />
          </label>

          {/* SIDEBAR BEHAVIOR */}
          <label className="block mt-4">
            <span className="text-sm text-gray-400">Sidebar</span>
            <select
              value={settings.sidebarBehavior}
              onChange={(e) => update("sidebarBehavior", e.target.value)}
              className="mt-1 bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 w-full"
            >
              <option value="fixed">Fixed</option>
              <option value="auto">Auto Hide</option>
            </select>
          </label>

          {/* DENSITY */}
          <label className="block mt-4">
            <span className="text-sm text-gray-400">Dashboard Density</span>
            <select
              value={settings.density}
              onChange={(e) => update("density", e.target.value)}
              className="mt-1 bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 w-full"
            >
              <option value="normal">Normal</option>
              <option value="compact">Compact</option>
            </select>
          </label>
        </div>

        {/* --- NOTIFICATIONS --- */}
        <div className="p-6 bg-[#111]/80 border border-white/10 rounded-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Bell className="text-[#CB52D4]" /> Notifications
          </h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => update("emailNotifications", e.target.checked)}
            />
            Email Notifications
          </label>

          <label className="flex items-center gap-3 mt-3">
            <input
              type="checkbox"
              checked={settings.notifyInvoicePaid}
              onChange={(e) => update("notifyInvoicePaid", e.target.checked)}
            />
            Notify when invoice is paid
          </label>

          <label className="flex items-center gap-3 mt-3">
            <input
              type="checkbox"
              checked={settings.notifyInvoiceOverdue}
              onChange={(e) => update("notifyInvoiceOverdue", e.target.checked)}
            />
            Notify when invoice is overdue
          </label>

          <label className="flex items-center gap-3 mt-3">
            <input
              type="checkbox"
              checked={settings.notifyAIInvoice}
              onChange={(e) => update("notifyAIInvoice", e.target.checked)}
            />
            Notify when AI generates invoice
          </label>

          <label className="block mt-4">
            <span className="text-sm text-gray-400">Frequency</span>
            <select
              value={settings.notificationFrequency}
              onChange={(e) => update("notificationFrequency", e.target.value)}
              className="mt-1 bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 w-full"
            >
              <option value="instant">Instant</option>
              <option value="daily">Daily Summary</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </label>
        </div>

        {/* --- AI SETTINGS --- */}
        <div className="p-6 bg-[#111]/80 border border-white/10 rounded-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Brain className="text-[#80FFF9]" /> AI Preferences
          </h2>

          <label className="block mb-4">
            <span className="text-sm text-gray-400">AI Tone</span>
            <select
              value={settings.aiTone}
              onChange={(e) => update("aiTone", e.target.value)}
              className="mt-1 bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 w-full"
            >
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="neutral">Neutral</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-400">Response Length</span>
            <select
              value={settings.aiLength}
              onChange={(e) => update("aiLength", e.target.value)}
              className="mt-1 bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 w-full"
            >
              <option value="short">Short</option>
              <option value="normal">Normal</option>
              <option value="detailed">Detailed</option>
            </select>
          </label>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex justify-end gap-4">
          <button
            onClick={saveAll}
            className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>

          <button
            onClick={deleteAccount}
            className="px-4 py-2 rounded-xl border border-red-600/40 text-red-400 hover:bg-red-600/10 transition flex items-center gap-2"
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState } from "react";
import {
  User,
  Mail,
  Bell,
  Moon,
  Trash2,
  Save,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [form, setForm] = useState({
    name: "Lucian Butuc",
    email: "lucian@example.com",
    notifications: true,
    darkMode: true,
  });

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleDelete = () => {
    toast.error("Account deletion not implemented yet!");
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-10">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <ShieldCheck className="text-[#80FFF9]" size={26} />
            Settings
          </h1>
          <p className="text-gray-400 text-sm">
            Manage your account preferences and appearance
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* ===== PROFILE ===== */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-6 shadow-lg shadow-indigo-900/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User size={18} className="text-[#80FFF9]" /> Profile
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 text-gray-200 focus:border-[#80FFF9] outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 text-gray-200 focus:border-[#80FFF9] outline-none mt-1"
              />
            </div>
          </div>
        </div>

        {/* ===== PREFERENCES ===== */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-6 shadow-lg shadow-indigo-900/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell size={18} className="text-[#CB52D4]" /> Preferences
          </h2>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifications}
                onChange={(e) => handleChange("notifications", e.target.checked)}
                className="w-5 h-5 rounded accent-[#80FFF9]"
              />
              <span className="text-gray-300">Enable Email Notifications</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.darkMode}
                onChange={(e) => handleChange("darkMode", e.target.checked)}
                className="w-5 h-5 rounded accent-[#CB52D4]"
              />
              <span className="text-gray-300 flex items-center gap-2">
                <Moon size={16} /> Enable Dark Mode
              </span>
            </label>
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 rounded-md hover:opacity-90 transition"
          >
            <Save size={18} /> Save Changes
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 border border-red-500/30 text-red-400 px-6 py-2 rounded-md hover:bg-red-500/10 transition"
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

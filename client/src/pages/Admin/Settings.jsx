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
        console.error(err);
        toast.error("Eroare la încărcarea setărilor");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleProfileSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await API.put(
        "/auth/update",
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Datele profilului actualizate");
    } catch (err) {
      toast.error("Eroare la actualizarea profilului.");
    } finally {
      setSaving(false);
    }
  };

  const handleBillingSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.put("/billing-profile", billing, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Date fiscale actualizate");
    } catch (err) {
      toast.error("Eroare la actualizarea datelor fiscale");
    }
  };

  const handlePasswordUpdate = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Completează toate câmpurile parolelor");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Parola nouă nu corespunde");
    }

    try {
      await API.put("/auth/password", { oldPassword, newPassword });
      toast.success("Parolă actualizată!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Eroare la actualizarea parolei.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Esti sigur?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete("/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      toast.error("Eroare la ștergerea contului.");
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
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-10 overflow-hidden pb-16 p-8 pt-30 space-y-8">
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10">
        
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <ShieldCheck className="text-[#80FFF9]" size={26} />
            Setări
          </h1>
          <p className="text-gray-400 text-sm">Gestionarea datelor contului și ale companiei</p>
        </div>

        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4">
            <UserIcon size={18} className="text-[#80FFF9]" />
            Datele Utilizatorului
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Nume Complet</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/50"/>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/50"/>
            </div>
          </div>

          <button onClick={handleProfileSave} disabled={saving} className="mt-5 px-4 py-2 rounded-xl bg-[#80FFF9]/20 border border-[#80FFF9]/40 hover:bg-[#80FFF9]/30 transition flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Salvare
          </button>
        </div>

        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#80FFF9]" />
            Schimbă parola
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-gray-400 text-sm">Parola Actuală</label>
              <input type={showPass.old ? "text" : "password"} value={passwordForm.oldPassword} placeholder="Enter old password..." onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200"/>
              <button type="button" onClick={() => setShowPass({ ...showPass, old: !showPass.old })} className="absolute right-3 top-9 text-gray-400 hover:text-white">
                {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label className="text-gray-400 text-sm">Parolă Nouă</label>
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
              <label className="text-gray-400 text-sm">Confirmă Parola Nouă</label>
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
            Actualizează Parola
          </button>
        </div>

        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4">
            <Building2 size={18} className="text-[#80FFF9]" /> Date Fiscale
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm">Denumire</label>
              <input type="text" placeholder="ex. Popescu Ion PFA" value={billing.business_name} onChange={(e) => setBilling({ ...billing, business_name: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"/>
            </div>

            <div>
              <label className="text-gray-400 text-sm">CIF / CUI</label>
              <input type="text" placeholder="ex: 12345678 or RO12345678" value={billing.cif} onChange={(e) => setBilling({ ...billing, cif: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"/>
            </div>

            <div className="md:col-span-1">
              <label className="text-gray-400 text-sm">Reg. Com.</label>
              <input type="text" placeholder="ex: F35/123/2026" value={billing.registration_number} onChange={(e) => setBilling({ ...billing, registration_number: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"/>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Telefon</label>
              <input type="text" placeholder="ex. 0712 345 678" value={billing.phone} onChange={(e) => setBilling({ ...billing, phone: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"/>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <input type="email" placeholder="ex. nume@gmail.com" value={billing.email} onChange={(e) => setBilling({ ...billing, email: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"/>
            </div>

            <div className="md:col-span-3">
              <label className="text-gray-400 text-sm">Adresa Completă</label>
              <input type="text" placeholder="ex: Str. Inovației, Nr. 10, Timișoara, Timiș" value={billing.address} onChange={(e) => setBilling({ ...billing, address: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30" />
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm">IBAN</label>
              <input type="text" placeholder="ex. RO78BTRL0000000000000000" value={billing.iban} onChange={(e) => setBilling({ ...billing, iban: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"/>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Bancă</label>
              <input type="text" placeholder="ex. BRD" value={billing.bank} onChange={(e) => setBilling({ ...billing, bank: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"/>
            </div>

            <div className="md:col-span-3">
              <label className="text-gray-400 text-sm">Logo Factură</label>
              <input type="text" placeholder="https://example.com/logo.png" value={billing.logo} onChange={(e) => setBilling({ ...billing, logo: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 mt-1 text-gray-200 focus:outline-none focus:border-[#80FFF9]/30"/>
              {billing.logo && (
                <img src={billing.logo} alt="Logo Preview" className="w-20 h-20 rounded-lg object-contain mt-3 border border-white/10" />
              )}
            </div>
          </div>

          <button onClick={handleBillingSave} className="mt-5 px-4 py-2 rounded-xl bg-[#80FFF9]/20 border border-[#80FFF9]/40 hover:bg-[#80FFF9]/30 transition flex items-center gap-2">
            <SaveIcon size={18} className="text-[#80FFF9]" />
            Salveaza Datele Fiscale
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/10 transition w-full sm:w-auto"
          >
            <Trash2 size={18} /> Șterge Contul
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
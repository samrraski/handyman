"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  city: string | null;
  province: string | null;
}

const CA_PROVINCES = ["AB", "BC", "SK", "MB", "ON", "QC", "NB", "NS", "PE", "NL", "YT", "NT", "NU"];

export default function SettingsView({
  profile,
  email,
}: {
  profile: Profile | null;
  email: string;
}) {
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    company_name: profile?.company_name ?? "",
    phone: profile?.phone ?? "",
    city: profile?.city ?? "",
    province: profile?.province ?? "AB",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const { error: err } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name || null,
        company_name: form.company_name || null,
        phone: form.phone || null,
        city: form.city || null,
        province: form.province || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile!.id);

    if (err) { setError(err.message); setSaving(false); return; }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Settings</h1>
        <p className="text-brand-gray-400 text-sm mt-0.5">Manage your profile and account.</p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-gray-200 p-6">
        <h2 className="font-semibold text-brand-black mb-4">Your Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-brand-gray-600 mb-1">Email</label>
            <input
              value={email}
              disabled
              className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm text-brand-gray-400 cursor-not-allowed"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-gray-600 mb-1">Full Name</label>
              <input
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                placeholder="John Smith"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-gray-600 mb-1">Company Name</label>
              <input
                value={form.company_name}
                onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                placeholder="Smith Renovations"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-gray-600 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(587) 000-0000"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-gray-600 mb-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="Calgary"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-gray-600 mb-1">Province</label>
              <select
                value={form.province}
                onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
              >
                {CA_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-yellow hover:bg-brand-yellow-hover disabled:opacity-60 text-brand-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle2 size={15} /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

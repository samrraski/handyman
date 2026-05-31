"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Save, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_CALCULATOR_SETTINGS, rowToCalculatorSettings } from "@/lib/calculator-settings";

function NumberField({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-brand-gray-500 mb-1.5">
        {label}
      </span>
      <div className="flex items-center rounded-xl border border-brand-gray-200 bg-white overflow-hidden focus-within:border-brand-yellow transition-colors">
        <input
          type="number"
          min="0"
          step="0.5"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full px-4 py-3 text-sm text-brand-black outline-none"
        />
        <span className="px-4 py-3 text-sm text-brand-gray-400 border-l border-brand-gray-200 bg-brand-gray-100">
          {suffix}
        </span>
      </div>
    </label>
  );
}

export default function CalculatorSettingsForm() {
  const [pricing, setPricing] = useState(DEFAULT_CALCULATOR_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("calculator_settings")
        .select("labor_rate, waste_percent, tax_rate")
        .eq("id", "default")
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        setError("Calculator settings table is not ready yet. Run the Supabase migration, then refresh this page.");
      } else {
        setPricing(rowToCalculatorSettings(data));
      }
      setLoading(false);
    }

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  function update(field: keyof typeof pricing, value: number) {
    setSaved(false);
    setError("");
    setPricing((current) => ({ ...current, [field]: value }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.from("calculator_settings").upsert({
      id: "default",
      labor_rate: pricing.laborRate,
      waste_percent: pricing.wastePercent,
      tax_rate: pricing.taxRate,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSaved(true);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-brand-black">Calculator Settings</h1>
        <p className="text-sm text-brand-gray-400 mt-0.5">
          Adjust pricing settings (labor rate, waste %, tax)
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-brand-gray-200 overflow-hidden">
        <div className="border-b border-brand-gray-200 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 flex items-center justify-center">
            <SlidersHorizontal size={18} className="text-brand-yellow" />
          </div>
          <div>
            <h2 className="font-bold text-brand-black">
              Adjust pricing settings (labor rate, waste %, tax)
            </h2>
            <p className="text-sm text-brand-gray-400">
              These calculator settings are only visible in the admin panel.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 flex items-center justify-center gap-2 text-sm text-brand-gray-400">
            <Loader2 size={16} className="animate-spin" />
            Loading settings...
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberField
              label="Labor rate"
              value={pricing.laborRate}
              suffix="/ hr"
              onChange={(value) => update("laborRate", value)}
            />
            <NumberField
              label="Waste percentage"
              value={pricing.wastePercent}
              suffix="%"
              onChange={(value) => update("wastePercent", value)}
            />
            <NumberField
              label="Tax"
              value={pricing.taxRate}
              suffix="%"
              onChange={(value) => update("taxRate", value)}
            />
          </div>
        )}

        <div className="px-5 py-4 border-t border-brand-gray-200 flex items-center justify-between gap-3">
          <p className="text-xs text-brand-gray-400">
            Public calculator estimates update immediately after these settings are saved.
          </p>
          <button
            type="submit"
            disabled={loading || saving}
            className="inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-black font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          Calculator settings saved. The public calculator will use these values now.
        </div>
      )}
    </div>
  );
}

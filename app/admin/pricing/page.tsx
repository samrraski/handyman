"use client";

import { useState } from "react";
import { Save, SlidersHorizontal } from "lucide-react";

const DEFAULT_PRICING = {
  laborRate: 65,
  wastePercent: 10,
  taxRate: 5,
};

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

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [saved, setSaved] = useState(false);

  function update(field: keyof typeof pricing, value: number) {
    setSaved(false);
    setPricing((current) => ({ ...current, [field]: value }));
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-brand-black">Pricing Settings</h1>
        <p className="text-sm text-brand-gray-400 mt-0.5">
          Adjust pricing settings for labour rate, waste percentage, and tax.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-brand-gray-200 overflow-hidden">
        <div className="border-b border-brand-gray-200 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 flex items-center justify-center">
            <SlidersHorizontal size={18} className="text-brand-yellow" />
          </div>
          <div>
            <h2 className="font-bold text-brand-black">Calculator pricing controls</h2>
            <p className="text-sm text-brand-gray-400">
              These settings are only visible in the admin panel.
            </p>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <NumberField
            label="Labour rate"
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

        <div className="px-5 py-4 border-t border-brand-gray-200 flex items-center justify-between gap-3">
          <p className="text-xs text-brand-gray-400">
            Current public calculator uses the standard Calgary defaults until these settings are connected to the database.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            <Save size={15} />
            Save Settings
          </button>
        </div>
      </form>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          Pricing settings saved in this admin session.
        </div>
      )}
    </div>
  );
}

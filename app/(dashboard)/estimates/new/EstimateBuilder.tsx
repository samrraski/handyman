"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";

type LineItemType = "labor" | "material" | "other";

interface LineItem {
  id: string;
  type: LineItemType;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

interface ClientOption {
  id: string;
  full_name: string;
}

const TYPE_LABELS: Record<LineItemType, string> = {
  labor: "Labor",
  material: "Material",
  other: "Other",
};

const TYPE_UNITS: Record<LineItemType, string> = {
  labor: "hr",
  material: "ea",
  other: "",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

const TAX_RATE = 5;

function newItem(type: LineItemType = "labor"): LineItem {
  return {
    id: crypto.randomUUID(),
    type,
    description: "",
    quantity: 1,
    unit: TYPE_UNITS[type],
    unit_price: 0,
  };
}

export default function EstimateBuilder({
  clients,
  initialEstimateNumber,
}: {
  clients: ClientOption[];
  initialEstimateNumber: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [estimateNumber, setEstimateNumber] = useState(initialEstimateNumber);
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([newItem("labor")]);

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const taxAmount = Math.round(subtotal * (TAX_RATE / 100) * 100) / 100;
  const total = subtotal + taxAmount;

  function addItem(type: LineItemType = "labor") {
    setItems((prev) => [...prev, newItem(type)]);
  }

  function removeItem(id: string) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const updated = { ...i, ...patch };
        if (patch.type && patch.type !== i.type) {
          updated.unit = TYPE_UNITS[patch.type];
        }
        return updated;
      })
    );
  }

  async function handleSave(status: "draft" | "sent") {
    if (!title.trim()) { setError("Please enter a title for the estimate."); return; }
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { data: estimate, error: estErr } = await supabase
      .from("estimates")
      .insert({
        client_id: clientId || null,
        estimate_number: estimateNumber.trim(),
        title: title.trim(),
        status,
        valid_until: validUntil || null,
        notes: notes || null,
        subtotal,
        tax_rate: TAX_RATE,
        tax_amount: taxAmount,
        total,
      })
      .select()
      .single();

    if (estErr) { setError(estErr.message); setSaving(false); return; }

    const validItems = items.filter((i) => i.description.trim());
    if (validItems.length > 0) {
      const lineItems = validItems.map((i, idx) => ({
        estimate_id: estimate.id,
        type: i.type,
        description: i.description.trim(),
        quantity: i.quantity,
        unit: i.unit || null,
        unit_price: i.unit_price,
        sort_order: idx,
      }));

      const { error: itemsErr } = await supabase.from("estimate_items").insert(lineItems);
      if (itemsErr) { setError(itemsErr.message); setSaving(false); return; }
    }

    router.push("/estimates");
  }

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/estimates"
            className="p-2 text-brand-gray-400 hover:text-brand-black hover:bg-white rounded-xl transition-colors border border-brand-gray-200"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-black">New Estimate</h1>
            <p className="text-brand-gray-400 text-sm mt-0.5">Build a quote for your client</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-white border border-brand-gray-200 hover:border-brand-yellow text-brand-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave("sent")}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            Save & Mark Sent
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left / main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Estimate details */}
          <div className="bg-white rounded-2xl border border-brand-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-brand-black text-sm">Estimate Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">
                  Estimate #
                </label>
                <input
                  value={estimateNumber}
                  onChange={(e) => setEstimateNumber(e.target.value)}
                  className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">Client</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                >
                  <option value="">No client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">
                  Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Basement Drywall & Painting — Johnson Residence"
                  className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-brand-black text-sm">Line Items</h2>
              <button
                onClick={() => addItem()}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-yellow hover:text-brand-yellow-hover transition-colors"
              >
                <Plus size={14} /> Add Line
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-brand-gray-200 bg-brand-gray-100">
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-brand-gray-400 w-28">Type</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-brand-gray-400">Description</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-brand-gray-400 w-20">Qty</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-brand-gray-400 w-20">Unit</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-brand-gray-400 w-28">Unit Price</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-brand-gray-400 w-28">Total</th>
                    <th className="px-2 py-2.5 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="px-2 py-2">
                        <select
                          value={item.type}
                          onChange={(e) =>
                            updateItem(item.id, { type: e.target.value as LineItemType })
                          }
                          className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand-yellow transition-colors"
                        >
                          {(Object.keys(TYPE_LABELS) as LineItemType[]).map((t) => (
                            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                          placeholder="Describe this line item..."
                          className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:border-brand-yellow transition-colors"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                          placeholder="hr"
                          className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price || ""}
                          onChange={(e) =>
                            updateItem(item.id, { unit_price: parseFloat(e.target.value) || 0 })
                          }
                          placeholder="0.00"
                          className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:border-brand-yellow transition-colors"
                        />
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-brand-black">
                        {fmt(item.quantity * item.unit_price)}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="p-1 text-brand-gray-300 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-brand-gray-200 flex gap-3">
              {(["labor", "material", "other"] as LineItemType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addItem(t)}
                  className="text-xs text-brand-gray-400 hover:text-brand-yellow font-medium transition-colors inline-flex items-center gap-1"
                >
                  <Plus size={11} /> {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-brand-gray-200 p-5">
            <h2 className="font-semibold text-brand-black text-sm mb-3">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Payment terms, scope notes, exclusions, special conditions..."
              className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors resize-none"
            />
          </div>
        </div>

        {/* Sidebar: totals + save */}
        <div className="sticky top-20">
          <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
            <div className="bg-brand-black px-5 py-4">
              <h2 className="text-white font-semibold text-sm">Estimate Total</h2>
            </div>
            <div className="p-5 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray-600">Subtotal</span>
                <span className="font-medium text-brand-black">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray-600">GST ({TAX_RATE}%)</span>
                <span className="font-medium text-brand-black">{fmt(taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-brand-gray-200">
                <span className="font-bold text-brand-black">Total (CAD)</span>
                <span className="font-bold text-xl text-brand-yellow">{fmt(total)}</span>
              </div>
            </div>
            <div className="px-5 pb-5 space-y-2">
              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="w-full bg-brand-gray-100 hover:bg-brand-gray-200 text-brand-black font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave("sent")}
                disabled={saving}
                className="w-full bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                Save & Mark Sent
              </button>
            </div>
          </div>

          <p className="text-xs text-brand-gray-400 text-center mt-3">
            Alberta GST (5%) applied. Prices in CAD.
          </p>
        </div>
      </div>
    </div>
  );
}

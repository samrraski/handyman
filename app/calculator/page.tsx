"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PublicNav from "@/components/PublicNav";
import { BUSINESS } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import {
  calculateDrywall, calculatePainting, calculateFlooring,
  calculateDoorsWindows, calculateHandyman,
} from "@/lib/estimator/formulas";
import { DEFAULT_PRICES } from "@/lib/estimator/prices";
import { DEFAULT_CALCULATOR_SETTINGS, rowToCalculatorSettings } from "@/lib/calculator-settings";
import type {
  ServiceId, Settings, EstimateResult,
  DrywallInputs, PaintingInputs, FlooringInputs,
  DoorsWindowsInputs, HandymanInputs,
} from "@/lib/estimator/types";
import {
  Layers, Paintbrush, LayoutGrid, DoorOpen, Wrench,
  Calculator, Loader2, Hammer,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

const SERVICES = [
  { id: "drywall" as ServiceId,       label: "Drywall",         icon: Layers    },
  { id: "painting" as ServiceId,      label: "Painting",        icon: Paintbrush },
  { id: "flooring" as ServiceId,      label: "Flooring",        icon: LayoutGrid },
  { id: "doors_windows" as ServiceId, label: "Doors & Windows", icon: DoorOpen  },
  { id: "handyman" as ServiceId,      label: "Handyman",        icon: Wrench    },
];

// ── Input primitives ──────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-brand-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, unit, min = 0, step = 0.5 }: {
  value: number; onChange: (v: number) => void; unit?: string; min?: number; step?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <input type="number" min={min} step={step} value={value || ""} onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-white border border-brand-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow transition-colors" />
      {unit && <span className="text-xs text-brand-gray-400 shrink-0 w-8">{unit}</span>}
    </div>
  );
}

function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-brand-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow transition-colors">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Chk({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-brand-yellow" />
      <span className="text-sm text-brand-gray-600">{label}</span>
    </label>
  );
}

// ── Service input forms ───────────────────────────────────────────────────────

function DrywallForm({ v, s }: { v: DrywallInputs; s: (p: Partial<DrywallInputs>) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Length"><NumInput value={v.length} onChange={(n) => s({ length: n })} unit="ft" /></Field>
        <Field label="Width"><NumInput value={v.width} onChange={(n) => s({ width: n })} unit="ft" /></Field>
        <Field label="Height"><NumInput value={v.height} onChange={(n) => s({ height: n })} unit="ft" /></Field>
      </div>
      <Field label="Wall Coverage">
        <Sel value={v.wallCoverage} onChange={(x) => s({ wallCoverage: x as DrywallInputs["wallCoverage"] })}
          options={[{ value: "all", label: "All 4 Walls" }, { value: "three", label: "3 Walls" }, { value: "two", label: "2 Walls" }, { value: "one", label: "1 Wall" }]} />
      </Field>
      <Field label="Material">
        <Sel value={v.materialType} onChange={(x) => s({ materialType: x as DrywallInputs["materialType"] })}
          options={[{ value: "regular", label: '1/2" Regular' }, { value: "moisture", label: '1/2" Moisture Resistant' }, { value: "fire", label: '5/8" Fire Rated' }]} />
      </Field>
      <Chk label="Include Ceiling" checked={v.includeCeiling} onChange={(b) => s({ includeCeiling: b })} />
    </div>
  );
}

function PaintingForm({ v, s }: { v: PaintingInputs; s: (p: Partial<PaintingInputs>) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Length"><NumInput value={v.length} onChange={(n) => s({ length: n })} unit="ft" /></Field>
        <Field label="Width"><NumInput value={v.width} onChange={(n) => s({ width: n })} unit="ft" /></Field>
        <Field label="Height"><NumInput value={v.height} onChange={(n) => s({ height: n })} unit="ft" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Coats">
          <Sel value={String(v.numCoats)} onChange={(x) => s({ numCoats: parseInt(x) })}
            options={[{ value: "1", label: "1 coat" }, { value: "2", label: "2 coats" }, { value: "3", label: "3 coats" }]} />
        </Field>
        <Field label="Paint Quality">
          <Sel value={v.materialType} onChange={(x) => s({ materialType: x as PaintingInputs["materialType"] })}
            options={[{ value: "standard", label: "Standard" }, { value: "premium", label: "Premium" }]} />
        </Field>
      </div>
      <Chk label="Include Ceiling" checked={v.includeCeiling} onChange={(b) => s({ includeCeiling: b })} />
      <Chk label="Include Primer" checked={v.includesPrimer} onChange={(b) => s({ includesPrimer: b })} />
    </div>
  );
}

function FlooringForm({ v, s }: { v: FlooringInputs; s: (p: Partial<FlooringInputs>) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Length"><NumInput value={v.length} onChange={(n) => s({ length: n })} unit="ft" /></Field>
        <Field label="Width"><NumInput value={v.width} onChange={(n) => s({ width: n })} unit="ft" /></Field>
      </div>
      <Field label="Material">
        <Sel value={v.materialType} onChange={(x) => s({ materialType: x as FlooringInputs["materialType"] })}
          options={[{ value: "lvp", label: "LVP / Vinyl Plank" }, { value: "laminate", label: "Laminate" }, { value: "hardwood", label: "Hardwood" }, { value: "tile", label: "Ceramic Tile" }, { value: "carpet", label: "Carpet" }]} />
      </Field>
      <Chk label="Include Underlayment" checked={v.includeUnderlayment} onChange={(b) => s({ includeUnderlayment: b })} />
    </div>
  );
}

function DoorsForm({ v, s }: { v: DoorsWindowsInputs; s: (p: Partial<DoorsWindowsInputs>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Interior Doors"><NumInput value={v.interiorDoors} onChange={(n) => s({ interiorDoors: n })} step={1} /></Field>
      <Field label="Exterior Doors"><NumInput value={v.exteriorDoors} onChange={(n) => s({ exteriorDoors: n })} step={1} /></Field>
      <Field label="Windows"><NumInput value={v.windows} onChange={(n) => s({ windows: n })} step={1} /></Field>
    </div>
  );
}

function HandymanForm({ v, s }: { v: HandymanInputs; s: (p: Partial<HandymanInputs>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Estimated Hours"><NumInput value={v.estimatedHours} onChange={(n) => s({ estimatedHours: n })} unit="hrs" /></Field>
      <Field label="Material Budget ($)"><NumInput value={v.materialBudget} onChange={(n) => s({ materialBudget: n })} step={10} /></Field>
    </div>
  );
}

// ── Calculator inner (needs search params) ────────────────────────────────────

function CalculatorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectParam = searchParams.get("service");
  const preselect = SERVICES.some((s) => s.id === preselectParam)
    ? (preselectParam as ServiceId)
    : null;

  const [service, setService]   = useState<ServiceId | null>(preselect);
  const [settings, setSettings] = useState<Settings>(DEFAULT_CALCULATOR_SETTINGS);
  const [includeMaterials, setIncludeMaterials] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("calculator_settings")
        .select("labor_rate, waste_percent, tax_rate")
        .eq("id", "default")
        .maybeSingle();

      if (mounted) {
        setSettings(rowToCalculatorSettings(data));
      }
    }

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const [drywall,  setDrywallRaw]  = useState<DrywallInputs>({ length: 0, width: 0, height: 9, includeCeiling: false, wallCoverage: "all", materialType: "regular" });
  const [painting, setPaintingRaw] = useState<PaintingInputs>({ length: 0, width: 0, height: 9, includeCeiling: true, numCoats: 2, includesPrimer: true, materialType: "standard" });
  const [flooring, setFlooringRaw] = useState<FlooringInputs>({ length: 0, width: 0, materialType: "lvp", includeUnderlayment: true });
  const [doors,    setDoorsRaw]    = useState<DoorsWindowsInputs>({ interiorDoors: 0, exteriorDoors: 0, windows: 0 });
  const [handyman, setHandymanRaw] = useState<HandymanInputs>({ estimatedHours: 0, materialBudget: 0 });

  const sd = (p: Partial<DrywallInputs>) => setDrywallRaw((v) => ({ ...v, ...p }));
  const sp = (p: Partial<PaintingInputs>) => setPaintingRaw((v) => ({ ...v, ...p }));
  const sf = (p: Partial<FlooringInputs>) => setFlooringRaw((v) => ({ ...v, ...p }));
  const sdo = (p: Partial<DoorsWindowsInputs>) => setDoorsRaw((v) => ({ ...v, ...p }));
  const sh = (p: Partial<HandymanInputs>) => setHandymanRaw((v) => ({ ...v, ...p }));

  const result = useMemo((): EstimateResult | null => {
    if (!service) return null;
    const p = DEFAULT_PRICES;
    const estimate = (() => {
      switch (service) {
      case "drywall":       return calculateDrywall(drywall, settings, p);
      case "painting":      return calculatePainting(painting, settings, p);
      case "flooring":      return calculateFlooring(flooring, settings, p);
      case "doors_windows": return calculateDoorsWindows(doors, settings, p);
      case "handyman":      return calculateHandyman(handyman, settings, p);
      }
    })();

    if (includeMaterials) return estimate;

    const subtotal = estimate.laborCost;
    const profitAmount = Math.round(subtotal * (settings.profitMargin / 100) * 100) / 100;
    const taxableAmount = subtotal + profitAmount;
    const taxAmount = Math.round(taxableAmount * (settings.taxRate / 100) * 100) / 100;

    return {
      ...estimate,
      materials: [],
      materialCost: 0,
      subtotal,
      profitAmount,
      taxAmount,
      total: Math.round((taxableAmount + taxAmount) * 100) / 100,
    };
  }, [service, drywall, painting, flooring, doors, handyman, settings, includeMaterials]);

  const hasResult = result && result.total > 0;

  // ── Inquiry form state ────────────────────────────────────────────────────

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");
  const [notes, setNotes]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleInquiry(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const supabase = createClient();
    const { error } = await supabase.from("inquiries").insert({
      name,
      email,
      phone: phone || null,
      service: service ?? null,
      address: address || null,
      description: notes || null,
      estimate: result ?? null,
      total: result?.total ?? null,
    });

    if (error) {
      setSubmitError("Something went wrong. Please try again or call us directly.");
      setSubmitting(false);
      return;
    }

    router.push("/thank-you");
  }

  return (
    <div className="space-y-6">
      {/* Service selector */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 p-5">
        <h2 className="text-sm font-semibold text-brand-black mb-3">1. Select your service</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {SERVICES.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setService(id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                service === id
                  ? "bg-brand-black border-brand-black text-white"
                  : "bg-brand-gray-100 border-brand-gray-200 text-brand-gray-600 hover:border-brand-yellow"
              }`}>
              <Icon size={18} className={service === id ? "text-brand-yellow" : ""} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {service && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
          {/* Inputs */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-brand-gray-200 p-5">
              <h2 className="text-sm font-semibold text-brand-black mb-3">2. Enter dimensions</h2>
              {service === "drywall"       && <DrywallForm  v={drywall}  s={sd}  />}
              {service === "painting"      && <PaintingForm v={painting} s={sp}  />}
              {service === "flooring"      && <FlooringForm v={flooring} s={sf}  />}
              {service === "doors_windows" && <DoorsForm    v={doors}    s={sdo} />}
              {service === "handyman"      && <HandymanForm v={handyman} s={sh}  />}
            </div>

            {/* Materials toggle */}
            <div className="bg-white rounded-2xl border border-brand-gray-200 p-5">
              <h2 className="text-sm font-semibold text-brand-black mb-3">3. Materials</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIncludeMaterials(true)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    includeMaterials
                      ? "bg-brand-black border-brand-black text-white"
                      : "bg-brand-gray-100 border-brand-gray-200 text-brand-gray-600 hover:border-brand-yellow"
                  }`}
                >
                  Include materials
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeMaterials(false)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    !includeMaterials
                      ? "bg-brand-black border-brand-black text-white"
                      : "bg-brand-gray-100 border-brand-gray-200 text-brand-gray-600 hover:border-brand-yellow"
                  }`}
                >
                  Labour only
                </button>
              </div>
              <p className="mt-3 text-xs text-brand-gray-400">
                Choose whether the estimate includes supplied materials or only labour.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 sticky top-20">
            {hasResult ? (
              <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
                <div className="bg-brand-black px-4 py-3">
                  <h3 className="text-white font-semibold text-sm">Your Estimate</h3>
                  <p className="text-brand-gray-400 text-xs mt-0.5">Approximate cost — final price confirmed on-site</p>
                </div>
                <div className="px-4 py-3 border-b border-brand-gray-200">
                  <p className="text-xs font-semibold text-brand-gray-400 uppercase tracking-wide mb-2">Materials</p>
                  <div className="space-y-1.5">
                    {result.materials.length > 0 ? (
                      result.materials.map((m, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-brand-gray-600 flex-1 pr-2">{m.name}</span>
                          <span className="text-brand-black font-medium shrink-0">{fmt(m.total)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-brand-gray-400">Not included in this estimate.</p>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 border-b border-brand-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray-600">Labour ({result.laborHours} hrs)</span>
                    <span className="text-brand-black font-medium">{fmt(result.laborCost)}</span>
                  </div>
                </div>
                <div className="px-4 py-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray-500">Subtotal</span>
                    <span>{fmt(result.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray-500">GST (5%)</span>
                    <span>{fmt(result.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-brand-gray-200">
                    <span className="font-bold text-brand-black">Estimate Total</span>
                    <span className="font-bold text-xl text-brand-yellow">{fmt(result.total)}</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <p className="text-xs text-brand-gray-400 text-center">
                    Fill out the form below to request a quote →
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-brand-gray-200 py-12 text-center">
                <Calculator size={28} className="mx-auto text-brand-gray-300 mb-2" />
                <p className="text-sm text-brand-gray-400">Enter dimensions to see your estimate</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Inquiry Form ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 p-6">
        <h2 className="text-lg font-bold text-brand-black mb-1">Request a Quote</h2>
        <p className="text-brand-gray-500 text-sm mb-5">
          {hasResult
            ? `Your estimate of ${fmt(result!.total)} will be included. We'll confirm the final price on-site.`
            : "No estimate yet? No problem — describe your project and we'll get back to you."}
        </p>

        <form onSubmit={handleInquiry} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Your Name *">
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors" />
            </Field>
            <Field label="Email *">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@email.com"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors" />
            </Field>
            <Field label="Phone">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(587) 000-0000"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors" />
            </Field>
            <Field label="Address in Calgary">
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St SW"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors" />
            </Field>
          </div>

          <Field label="Additional Notes">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Any extra details about your project, timeline, or questions..."
              className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors resize-none" />
          </Field>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">{submitError}</div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full bg-brand-yellow hover:bg-brand-yellow-hover disabled:opacity-50 text-brand-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Sending..." : "Send Request →"}
          </button>

          <p className="text-xs text-center text-brand-gray-400">
            We respond within 24 hours · {BUSINESS.phone}
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-brand-gray-100">
      <PublicNav />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-2">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-brand-black">Free Estimate Calculator</h1>
          <p className="text-brand-gray-600 text-sm mt-1">
            Get an instant material &amp; labour estimate for your project — no signup required.
          </p>
        </div>
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-gray-400" /></div>}>
          <CalculatorInner />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-brand-black border-t border-brand-gray-800 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-brand-yellow rounded-md flex items-center justify-center">
            <Hammer size={12} className="text-brand-black" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-sm">{BUSINESS.name}</span>
        </div>
        <p className="text-brand-gray-600 text-sm">{BUSINESS.area} · {BUSINESS.phone}</p>
      </footer>
    </div>
  );
}

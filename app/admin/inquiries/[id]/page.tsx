"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

const STATUS_OPTIONS = ["new", "contacted", "quoted", "booked", "completed", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  new:       "bg-brand-yellow/15 text-yellow-700",
  contacted: "bg-blue-50 text-blue-600",
  quoted:    "bg-purple-50 text-purple-600",
  booked:    "bg-green-50 text-green-700",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-500",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();

  interface Inquiry {
    id: string; name: string; email: string; phone?: string; address?: string;
    service?: string; description?: string; total?: number; status: string;
    admin_notes?: string; created_at: string;
    estimate?: { materials: { name: string; total: number }[]; laborCost: number; total: number };
  }
  const [inq, setInq] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("inquiries").select("*").eq("id", id).single();
      if (data) {
        setInq(data);
        setStatus(data.status as string);
        setNotes((data.admin_notes as string) ?? "");
      }
    }
    load();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("inquiries").update({ status, admin_notes: notes }).eq("id", id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!inq) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-brand-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/inquiries" className="p-1.5 rounded-lg hover:bg-brand-gray-200 transition-colors">
            <ChevronLeft size={18} className="text-brand-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-brand-black leading-none">{inq.name as string}</h1>
            <p className="text-xs text-brand-gray-400 mt-0.5">
              {new Date(inq.created_at).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover disabled:opacity-50 text-brand-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-brand-gray-200 p-5">
            <h2 className="text-sm font-semibold text-brand-black mb-3">Customer</h2>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3"><span className="text-brand-gray-400 w-16 shrink-0">Name</span><span className="text-brand-black font-medium">{inq.name}</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-400 w-16 shrink-0">Email</span><a href={`mailto:${inq.email}`} className="text-brand-yellow hover:underline">{inq.email}</a></div>
              {inq.phone && <div className="flex gap-3"><span className="text-brand-gray-400 w-16 shrink-0">Phone</span><a href={`tel:${inq.phone}`} className="text-brand-yellow hover:underline">{inq.phone}</a></div>}
              {inq.address && <div className="flex gap-3"><span className="text-brand-gray-400 w-16 shrink-0">Address</span><span className="text-brand-black">{inq.address}</span></div>}
              {inq.service && <div className="flex gap-3"><span className="text-brand-gray-400 w-16 shrink-0">Service</span><span className="text-brand-black capitalize">{inq.service.replace("_", " ")}</span></div>}
            </div>
          </div>

          {inq.description && (
            <div className="bg-white rounded-xl border border-brand-gray-200 p-5">
              <h2 className="text-sm font-semibold text-brand-black mb-2">Customer Notes</h2>
              <p className="text-sm text-brand-gray-700 leading-relaxed">{inq.description}</p>
            </div>
          )}

          {inq.estimate && (
            <div className="bg-white rounded-xl border border-brand-gray-200 p-5">
              <h2 className="text-sm font-semibold text-brand-black mb-3">Calculator Estimate</h2>
              <div className="space-y-1.5 mb-3">
                {inq.estimate.materials.map((m, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-brand-gray-600">{m.name}</span>
                    <span className="text-brand-black font-medium">{fmt(m.total)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-1 border-t border-brand-gray-200">
                  <span className="text-brand-gray-600">Labour</span>
                  <span className="text-brand-black font-medium">{fmt(inq.estimate.laborCost)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-gray-200">
                <span className="font-bold text-brand-black text-sm">Estimate Total</span>
                <span className="font-bold text-brand-yellow">{fmt(inq.estimate.total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status + Notes */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-brand-gray-200 p-5">
            <h2 className="text-sm font-semibold text-brand-black mb-3">Status</h2>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <label key={s} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="accent-brand-yellow" />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[s]}`}>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-brand-gray-200 p-5">
            <h2 className="text-sm font-semibold text-brand-black mb-2">Admin Notes</h2>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5}
              placeholder="Internal notes, follow-up actions, quoted price..."
              className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow transition-colors resize-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

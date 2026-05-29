"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Plus, FileText, Trash2 } from "lucide-react";

type EstimateStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

interface Estimate {
  id: string;
  estimate_number: string;
  title: string;
  status: EstimateStatus;
  total: number | null;
  created_at: string;
  valid_until: string | null;
  clients: { id: string; full_name: string } | null;
}

const STATUS_COLORS: Record<EstimateStatus, string> = {
  draft:    "bg-gray-100 text-gray-600",
  sent:     "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-600",
  expired:  "bg-orange-100 text-orange-700",
};

const STATUS_LABELS: Record<EstimateStatus, string> = {
  draft:    "Draft",
  sent:     "Sent",
  accepted: "Accepted",
  declined: "Declined",
  expired:  "Expired",
};

const STATUSES: EstimateStatus[] = ["draft", "sent", "accepted", "declined", "expired"];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

export default function EstimatesView({ initialEstimates }: { initialEstimates: Estimate[] }) {
  const [estimates, setEstimates] = useState(initialEstimates);
  const [filter, setFilter] = useState<EstimateStatus | "all">("all");

  const filtered =
    filter === "all" ? estimates : estimates.filter((e) => e.status === filter);

  async function handleDelete(id: string) {
    if (!confirm("Delete this estimate? This cannot be undone.")) return;
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("estimates").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    setEstimates((prev) => prev.filter((e) => e.id !== id));
  }

  async function updateStatus(id: string, status: EstimateStatus) {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("estimates").update({ status }).eq("id", id);
    if (error) { alert(error.message); return; }
    setEstimates((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Estimates</h1>
          <p className="text-brand-gray-400 text-sm mt-0.5">
            {estimates.length} estimate{estimates.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/estimates/new"
          className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> New Estimate
        </Link>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-brand-black text-white"
              : "bg-white border border-brand-gray-200 text-brand-gray-600 hover:border-brand-yellow"
          }`}
        >
          All ({estimates.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? "bg-brand-black text-white"
                : "bg-white border border-brand-gray-200 text-brand-gray-600 hover:border-brand-yellow"
            }`}
          >
            {STATUS_LABELS[s]} ({estimates.filter((e) => e.status === s).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="mx-auto text-brand-gray-300 mb-3" />
            <p className="text-brand-gray-400 text-sm mb-4">
              {filter !== "all" ? "No estimates with this status." : "No estimates yet."}
            </p>
            {filter === "all" && (
              <Link
                href="/estimates/new"
                className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                <Plus size={15} /> Create First Estimate
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-brand-gray-200 bg-brand-gray-100">
                  <th className="px-5 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">#</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Title</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Client</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Valid Until</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide text-right">Total</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-200">
                {filtered.map((est) => (
                  <tr key={est.id} className="hover:bg-brand-gray-100 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-brand-gray-400">
                      {est.estimate_number}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-brand-black">{est.title}</td>
                    <td className="px-4 py-3.5 text-brand-gray-600">
                      {est.clients?.full_name ?? <span className="text-brand-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={est.status}
                        onChange={(e) => updateStatus(est.id, e.target.value as EstimateStatus)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer border-0 focus:outline-none ${STATUS_COLORS[est.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-brand-gray-600">
                      {est.valid_until ? (
                        new Date(est.valid_until + "T00:00:00").toLocaleDateString("en-CA")
                      ) : (
                        <span className="text-brand-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-brand-black">
                      {est.total != null ? (
                        fmt(est.total)
                      ) : (
                        <span className="text-brand-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleDelete(est.id)}
                        className="p-1.5 text-brand-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

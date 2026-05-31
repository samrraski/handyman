"use client";

import { useState } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Plus, Search, Pencil, Trash2, ClipboardList, X, Loader2 } from "lucide-react";

type JobStatus = "lead" | "scheduled" | "in_progress" | "completed" | "cancelled";

interface Job {
  id: string;
  title: string;
  description: string | null;
  status: JobStatus;
  work_type: string | null;
  assigned_to: string | null;
  client_id: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  total_amount: number | null;
  notes: string | null;
  created_at: string;
  clients: { id: string; full_name: string } | null;
}

interface ClientOption {
  id: string;
  full_name: string;
}

const STATUS_COLORS: Record<JobStatus, string> = {
  lead:        "bg-blue-100 text-blue-700",
  scheduled:   "bg-purple-100 text-purple-700",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed:   "bg-green-100 text-green-700",
  cancelled:   "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<JobStatus, string> = {
  lead:        "Lead",
  scheduled:   "Scheduled",
  in_progress: "In Progress",
  completed:   "Completed",
  cancelled:   "Cancelled",
};

const STATUSES: JobStatus[] = ["lead", "scheduled", "in_progress", "completed", "cancelled"];

const WORK_TYPES = [
  { value: "drywall",       label: "Drywall" },
  { value: "painting",      label: "Painting" },
  { value: "flooring",      label: "Flooring" },
  { value: "doors_windows", label: "Doors & Windows" },
  { value: "handyman",      label: "Handyman" },
  { value: "electrical",    label: "Electrical" },
  { value: "plumbing",      label: "Plumbing" },
  { value: "roofing",       label: "Roofing" },
  { value: "landscaping",   label: "Landscaping" },
  { value: "other",         label: "Other" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "lead" as JobStatus,
  work_type: "",
  assigned_to: "",
  client_id: "",
  location: "",
  start_date: "",
  end_date: "",
  total_amount: "",
  notes: "",
};

export default function JobsView({
  initialJobs,
  clients,
}: {
  initialJobs: Job[];
  clients: ClientOption[];
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  const filtered = jobs.filter((j) => {
    const matchStatus = filter === "all" || j.status === filter;
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.clients?.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (j.assigned_to ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setError("");
    setModal("add");
  }

  function openEdit(job: Job) {
    setForm({
      title: job.title,
      description: job.description ?? "",
      status: job.status,
      work_type: job.work_type ?? "",
      assigned_to: job.assigned_to ?? "",
      client_id: job.client_id ?? "",
      location: job.location ?? "",
      start_date: job.start_date ?? "",
      end_date: job.end_date ?? "",
      total_amount: job.total_amount?.toString() ?? "",
      notes: job.notes ?? "",
    });
    setEditing(job);
    setError("");
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
  }

  async function handleStatusChange(jobId: string, newStatus: JobStatus) {
    setChangingStatus(jobId);
    const supabase = createSupabaseClient();
    const { error: err } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", jobId);
    if (!err) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
      );
    }
    setChangingStatus(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const supabase = createSupabaseClient();

    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      status: form.status,
      work_type: form.work_type || null,
      assigned_to: form.assigned_to || null,
      client_id: form.client_id || null,
      location: form.location || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      total_amount: form.total_amount ? parseFloat(form.total_amount) : null,
      notes: form.notes || null,
    };

    if (modal === "add") {
      const { data, error: err } = await supabase
        .from("jobs")
        .insert(payload)
        .select("*, clients(id, full_name)")
        .single();
      if (err) { setError(err.message); setSaving(false); return; }
      setJobs((prev) => [data as Job, ...prev]);
    } else if (editing) {
      const { data, error: err } = await supabase
        .from("jobs")
        .update(payload)
        .eq("id", editing.id)
        .select("*, clients(id, full_name)")
        .single();
      if (err) { setError(err.message); setSaving(false); return; }
      setJobs((prev) => prev.map((j) => (j.id === editing.id ? (data as Job) : j)));
    }

    setSaving(false);
    closeModal();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    const supabase = createSupabaseClient();
    const { error: err } = await supabase.from("jobs").delete().eq("id", id);
    if (err) { alert(err.message); return; }
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Jobs</h1>
          <p className="text-brand-gray-400 text-sm mt-0.5">
            {jobs.length} total job{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> Add Job
        </button>
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
          All ({jobs.length})
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
            {STATUS_LABELS[s]} ({jobs.filter((j) => j.status === s).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs, clients, or workers..."
          className="w-full bg-white border border-brand-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList size={32} className="mx-auto text-brand-gray-300 mb-3" />
            <p className="text-brand-gray-400 text-sm">
              {search || filter !== "all"
                ? "No jobs match your filter."
                : "No jobs yet. Add your first!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-brand-gray-200 bg-brand-gray-100">
                  <th className="px-5 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Job</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Client</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide hidden lg:table-cell">Assigned To</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide hidden sm:table-cell">Start</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide text-right">Amount</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-200">
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-brand-gray-100 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-brand-black">{job.title}</p>
                      {job.location && (
                        <p className="text-xs text-brand-gray-400 mt-0.5">{job.location}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-brand-gray-600">
                      {job.clients?.full_name ?? <span className="text-brand-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-brand-gray-600 capitalize hidden md:table-cell">
                      {job.work_type
                        ? WORK_TYPES.find((w) => w.value === job.work_type)?.label ?? job.work_type
                        : <span className="text-brand-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-brand-gray-600 hidden lg:table-cell">
                      {job.assigned_to ?? <span className="text-brand-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="relative">
                        {changingStatus === job.id ? (
                          <Loader2 size={14} className="animate-spin text-brand-gray-400" />
                        ) : (
                          <select
                            value={job.status}
                            onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-yellow ${STATUS_COLORS[job.status]}`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-brand-gray-600 hidden sm:table-cell">
                      {job.start_date
                        ? new Date(job.start_date + "T00:00:00").toLocaleDateString("en-CA")
                        : <span className="text-brand-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-brand-black">
                      {job.total_amount != null
                        ? fmt(job.total_amount)
                        : <span className="text-brand-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(job)}
                          className="p-1.5 text-brand-gray-400 hover:text-brand-black hover:bg-brand-gray-200 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 text-brand-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-200">
              <h2 className="font-bold text-brand-black">
                {modal === "add" ? "Add Job" : "Edit Job"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 text-brand-gray-400 hover:text-brand-black rounded-lg hover:bg-brand-gray-100 transition-colors"
              >
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">Job Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Basement Drywall — Johnson Residence"
                  className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brand-gray-600 mb-1">Type of Work</label>
                  <select
                    value={form.work_type}
                    onChange={(e) => setForm((f) => ({ ...f, work_type: e.target.value }))}
                    className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  >
                    <option value="">Select type...</option>
                    {WORK_TYPES.map((w) => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-gray-600 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as JobStatus }))}
                    className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brand-gray-600 mb-1">Client</label>
                  <select
                    value={form.client_id}
                    onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}
                    className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  >
                    <option value="">No client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-gray-600 mb-1">Assigned To (Worker)</label>
                  <input
                    value={form.assigned_to}
                    onChange={(e) => setForm((f) => ({ ...f, assigned_to: e.target.value }))}
                    placeholder="Worker's name"
                    className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">Location / Address</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="123 Main St SW, Calgary"
                  className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brand-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                    className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                    className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-gray-600 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.total_amount}
                    onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="What does this job involve?"
                  className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="Internal notes..."
                  className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-brand-gray-100 hover:bg-brand-gray-200 text-brand-gray-600 font-medium py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-yellow hover:bg-brand-yellow-hover disabled:opacity-60 text-brand-black font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving..." : modal === "add" ? "Add Job" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

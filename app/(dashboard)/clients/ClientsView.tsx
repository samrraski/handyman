"use client";

import { useState } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Plus, Search, Pencil, Trash2, User, X, Phone, Mail, MapPin } from "lucide-react";

interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  created_at: string;
}

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
};

export default function ClientsView({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (c.phone ?? "").includes(search)
  );

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setError("");
    setModal("add");
  }

  function openEdit(client: Client) {
    setForm({
      full_name: client.full_name,
      email: client.email ?? "",
      phone: client.phone ?? "",
      address: client.address ?? "",
      city: client.city ?? "",
      notes: client.notes ?? "",
    });
    setEditing(client);
    setError("");
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const supabase = createSupabaseClient();

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      address: form.address || null,
      city: form.city || null,
      notes: form.notes || null,
    };

    if (modal === "add") {
      const { data, error: err } = await supabase
        .from("clients")
        .insert(payload)
        .select()
        .single();
      if (err) { setError(err.message); setSaving(false); return; }
      setClients((prev) =>
        [...prev, data as Client].sort((a, b) => a.full_name.localeCompare(b.full_name))
      );
    } else if (editing) {
      const { data, error: err } = await supabase
        .from("clients")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (err) { setError(err.message); setSaving(false); return; }
      setClients((prev) => prev.map((c) => (c.id === editing.id ? (data as Client) : c)));
    }

    setSaving(false);
    closeModal();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client? This cannot be undone.")) return;
    const supabase = createSupabaseClient();
    const { error: err } = await supabase.from("clients").delete().eq("id", id);
    if (err) { alert(err.message); return; }
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Clients</h1>
          <p className="text-brand-gray-400 text-sm mt-0.5">
            {clients.length} client{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full bg-white border border-brand-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <User size={32} className="mx-auto text-brand-gray-300 mb-3" />
            <p className="text-brand-gray-400 text-sm">
              {search ? "No clients match your search." : "No clients yet. Add your first one!"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-brand-gray-200">
            {filtered.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-brand-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-brand-yellow/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-brand-black">
                      {c.full_name[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-black truncate">{c.full_name}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      {c.email && (
                        <span className="flex items-center gap-1 text-xs text-brand-gray-400">
                          <Mail size={10} /> {c.email}
                        </span>
                      )}
                      {c.phone && (
                        <span className="flex items-center gap-1 text-xs text-brand-gray-400">
                          <Phone size={10} /> {c.phone}
                        </span>
                      )}
                      {c.city && (
                        <span className="flex items-center gap-1 text-xs text-brand-gray-400">
                          <MapPin size={10} /> {c.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-4">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-2 text-brand-gray-400 hover:text-brand-black hover:bg-brand-gray-200 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 text-brand-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-200">
              <h2 className="font-bold text-brand-black">
                {modal === "add" ? "Add Client" : "Edit Client"}
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
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">Full Name *</label>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brand-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="john@email.com"
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-brand-gray-600 mb-1">Address</label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="123 Main St SW"
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
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-gray-600 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="Any notes about this client..."
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
                  className="flex-1 bg-brand-yellow hover:bg-brand-yellow-hover disabled:opacity-60 text-brand-black font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {saving ? "Saving..." : modal === "add" ? "Add Client" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

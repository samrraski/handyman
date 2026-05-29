import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";

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

export default async function AdminInquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("id, name, email, phone, service, total, status, created_at")
    .order("created_at", { ascending: false });

  const newCount = inquiries?.filter((i) => i.status === "new").length ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-black">Inquiries</h1>
          <p className="text-sm text-brand-gray-400 mt-0.5">
            {inquiries?.length ?? 0} total
            {newCount > 0 && <span className="ml-2 text-brand-yellow font-semibold">· {newCount} new</span>}
          </p>
        </div>
      </div>

      {inquiries && inquiries.length > 0 ? (
        <div className="bg-white rounded-xl border border-brand-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-gray-200 bg-brand-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide hidden sm:table-cell">Service</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Estimate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray-400 uppercase tracking-wide">Status</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-200">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-brand-gray-100 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-brand-black">{inq.name}</div>
                    <div className="text-xs text-brand-gray-400">{inq.email}</div>
                  </td>
                  <td className="px-4 py-3 text-brand-gray-600 capitalize hidden sm:table-cell">
                    {inq.service?.replace("_", " ") ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-brand-gray-400 hidden md:table-cell">
                    {new Date(inq.created_at).toLocaleDateString("en-CA")}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-black">
                    {inq.total ? fmt(inq.total) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[inq.status] ?? ""}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/inquiries/${inq.id}`}>
                      <ArrowRight size={15} className="text-brand-gray-400 hover:text-brand-black transition-colors" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-gray-200 py-20 text-center">
          <ClipboardList size={36} className="mx-auto text-brand-gray-200 mb-3" />
          <p className="text-sm text-brand-gray-400">No inquiries yet. They&apos;ll appear here when customers submit a request.</p>
        </div>
      )}
    </div>
  );
}

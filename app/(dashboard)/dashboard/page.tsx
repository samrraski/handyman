import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, ClipboardList, FileText, DollarSign, Plus, ArrowRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  lead:        "bg-blue-100 text-blue-700",
  scheduled:   "bg-purple-100 text-purple-700",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed:   "bg-green-100 text-green-700",
  cancelled:   "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  lead:        "Lead",
  scheduled:   "Scheduled",
  in_progress: "In Progress",
  completed:   "Completed",
  cancelled:   "Cancelled",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

interface RecentJob {
  id: string;
  title: string;
  status: string;
  total_amount: number | null;
  clients: { full_name: string } | null;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [clientsRes, jobsRes, estimatesRes, recentJobsRes] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("contractor_id", user.id),
    supabase.from("jobs").select("status, total_amount").eq("contractor_id", user.id),
    supabase.from("estimates").select("id, status").eq("contractor_id", user.id),
    supabase
      .from("jobs")
      .select("id, title, status, total_amount, clients(full_name)")
      .eq("contractor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const clientCount = clientsRes.count ?? 0;
  const jobs = jobsRes.data ?? [];
  const activeJobs = jobs.filter((j) => ["lead", "scheduled", "in_progress"].includes(j.status)).length;
  const revenue = jobs
    .filter((j) => j.status === "completed")
    .reduce((sum, j) => sum + (j.total_amount ?? 0), 0);
  const openEstimates = (estimatesRes.data ?? []).filter((e) =>
    ["draft", "sent"].includes(e.status)
  ).length;
  const recentJobs = (recentJobsRes.data ?? []) as unknown as RecentJob[];

  const stats = [
    { label: "Clients", value: clientCount, icon: Users, href: "/clients", color: "text-blue-500" },
    { label: "Active Jobs", value: activeJobs, icon: ClipboardList, href: "/jobs", color: "text-brand-yellow" },
    { label: "Open Estimates", value: openEstimates, icon: FileText, href: "/estimates", color: "text-purple-500" },
    { label: "Revenue (completed)", value: fmt(revenue), icon: DollarSign, href: "/jobs", color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Dashboard</h1>
          <p className="text-brand-gray-400 text-sm mt-0.5">Here&apos;s what&apos;s happening.</p>
        </div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-5 border border-brand-gray-200 hover:border-brand-yellow transition-colors group"
          >
            <div className="w-9 h-9 bg-brand-gray-100 group-hover:bg-brand-yellow/10 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-brand-black">{value}</p>
            <p className="text-xs text-brand-gray-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent jobs */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-gray-200">
          <h2 className="font-semibold text-brand-black">Recent Jobs</h2>
          <Link
            href="/jobs"
            className="text-xs text-brand-yellow hover:text-brand-yellow-hover font-medium flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {recentJobs.length === 0 ? (
          <div className="py-14 text-center text-sm text-brand-gray-400">
            No jobs yet.{" "}
            <Link href="/jobs" className="text-brand-yellow hover:underline">
              Add your first job →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-brand-gray-200">
            {recentJobs.map((job) => (
              <li
                key={job.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-brand-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-brand-black">{job.title}</p>
                  <p className="text-xs text-brand-gray-400 mt-0.5">
                    {job.clients?.full_name ?? "No client"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[job.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {STATUS_LABELS[job.status] ?? job.status}
                  </span>
                  <span className="text-sm font-semibold text-brand-black w-24 text-right">
                    {fmt(job.total_amount ?? 0)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/clients", label: "Add a Client", desc: "Store contact info for clients", icon: Users },
          { href: "/estimates/new", label: "New Estimate", desc: "Build and send a quote", icon: FileText },
          { href: "/jobs", label: "Manage Jobs", desc: "Track progress and status", icon: ClipboardList },
        ].map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl border border-brand-gray-200 p-5 hover:border-brand-yellow transition-colors group flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-brand-gray-100 group-hover:bg-brand-yellow/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
              <Icon
                size={18}
                className="text-brand-gray-600 group-hover:text-brand-yellow transition-colors"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-black">{label}</p>
              <p className="text-xs text-brand-gray-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

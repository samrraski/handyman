import { createClient } from "@/lib/supabase/server";
import JobsView from "./JobsView";

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [jobsRes, clientsRes] = await Promise.all([
    supabase
      .from("jobs")
      .select("*, clients(id, full_name)")
      .eq("contractor_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("clients")
      .select("id, full_name")
      .eq("contractor_id", user!.id)
      .order("full_name", { ascending: true }),
  ]);

  return (
    <JobsView
      initialJobs={jobsRes.data ?? []}
      clients={clientsRes.data ?? []}
    />
  );
}

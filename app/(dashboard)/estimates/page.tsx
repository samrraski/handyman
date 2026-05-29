import { createClient } from "@/lib/supabase/server";
import EstimatesView from "./EstimatesView";

export default async function EstimatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: estimates } = await supabase
    .from("estimates")
    .select("*, clients(id, full_name)")
    .eq("contractor_id", user!.id)
    .order("created_at", { ascending: false });

  return <EstimatesView initialEstimates={estimates ?? []} />;
}

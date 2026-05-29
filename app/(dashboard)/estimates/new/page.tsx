import { createClient } from "@/lib/supabase/server";
import EstimateBuilder from "./EstimateBuilder";

export default async function NewEstimatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [clientsRes, countRes] = await Promise.all([
    supabase
      .from("clients")
      .select("id, full_name")
      .eq("contractor_id", user!.id)
      .order("full_name", { ascending: true }),
    supabase
      .from("estimates")
      .select("id", { count: "exact", head: true })
      .eq("contractor_id", user!.id),
  ]);

  const nextNumber = `EST-${String((countRes.count ?? 0) + 1).padStart(4, "0")}`;

  return (
    <EstimateBuilder
      clients={clientsRes.data ?? []}
      initialEstimateNumber={nextNumber}
    />
  );
}

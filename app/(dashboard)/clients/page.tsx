import { createClient } from "@/lib/supabase/server";
import ClientsView from "./ClientsView";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("contractor_id", user!.id)
    .order("full_name", { ascending: true });

  return <ClientsView initialClients={clients ?? []} />;
}

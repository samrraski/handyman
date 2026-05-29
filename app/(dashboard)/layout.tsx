import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TopNav from "@/components/TopNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Contractor";

  return (
    <div className="min-h-screen bg-brand-gray-100">
      <TopNav userName={displayName} />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

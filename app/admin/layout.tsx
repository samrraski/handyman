import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Hammer, ClipboardList, LogOut } from "lucide-react";
import { BUSINESS } from "@/lib/config";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-brand-gray-100">
      {/* Admin top bar */}
      <header className="bg-brand-black border-b border-brand-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-13 py-2">
          <div className="flex items-center gap-4">
            <Link href="/admin/inquiries" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-yellow rounded-md flex items-center justify-center">
                <Hammer size={12} className="text-brand-black" strokeWidth={2.5} />
              </div>
              <span className="text-white font-bold text-sm">{BUSINESS.name}</span>
              <span className="text-brand-gray-600 text-xs ml-1">Admin</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/admin/inquiries"
                className="flex items-center gap-1.5 text-brand-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-brand-gray-800 transition-colors">
                <ClipboardList size={14} /> Inquiries
              </Link>
            </nav>
          </div>
          <form action="/api/auth/signout" method="post">
            <Link href="/sign-in" className="flex items-center gap-1.5 text-brand-gray-400 hover:text-red-400 text-sm transition-colors">
              <LogOut size={14} /> Sign Out
            </Link>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

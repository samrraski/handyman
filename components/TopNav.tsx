"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Users,
  Calendar,
  Settings,
  LogOut,
  Hammer,
  Inbox,
  PenLine,
  SlidersHorizontal,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/jobs",       label: "Jobs",        icon: ClipboardList   },
  { href: "/estimates",  label: "Estimates",   icon: FileText        },
  { href: "/clients",    label: "Clients",     icon: Users           },
  { href: "/inquiries",  label: "Inquiries",   icon: Inbox           },
  { href: "/content",    label: "Content",     icon: PenLine         },
  { href: "/calculator-settings", label: "Calculator Settings", icon: SlidersHorizontal },
  { href: "/schedule",   label: "Schedule",    icon: Calendar        },
];

export default function TopNav({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="bg-brand-black border-b border-brand-gray-800 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center h-14 gap-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-brand-yellow rounded-md flex items-center justify-center">
              <Hammer size={14} className="text-brand-black" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              Nova<span className="text-brand-yellow">reno</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-yellow text-brand-black"
                      : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-800"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/settings"
              className="p-1.5 rounded-lg text-brand-gray-400 hover:text-white hover:bg-brand-gray-800 transition-colors"
            >
              <Settings size={17} />
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-brand-gray-800">
              <div className="w-7 h-7 rounded-full bg-brand-yellow flex items-center justify-center text-brand-black font-bold text-xs">
                {userName ? userName[0].toUpperCase() : "U"}
              </div>
              <span className="hidden lg:block text-sm text-brand-gray-200 max-w-[120px] truncate">
                {userName || "Contractor"}
              </span>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-brand-gray-400 hover:text-red-400 hover:bg-brand-gray-800 transition-colors"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

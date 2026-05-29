import Link from "next/link";
import { Hammer, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/config";

export default function PublicNav() {
  return (
    <header className="bg-brand-black border-b border-brand-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-yellow rounded-md flex items-center justify-center">
              <Hammer size={14} className="text-brand-black" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              {BUSINESS.name}
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/services" className="text-brand-gray-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
              Services
            </Link>
            <Link href="/calculator" className="text-brand-gray-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
              Calculator
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a href={`tel:${BUSINESS.phone}`} className="hidden sm:flex items-center gap-1.5 text-brand-gray-400 hover:text-white text-sm transition-colors">
              <Phone size={14} />
              {BUSINESS.phone}
            </a>
            <Link
              href="/calculator"
              className="bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold text-sm px-4 py-1.5 rounded-lg transition-colors"
            >
              Free Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

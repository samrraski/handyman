"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hammer, Phone, ChevronDown, Menu, X } from "lucide-react";
import { BUSINESS } from "@/lib/config";

const ABOUT_LINKS = [
  { href: "/about/our-story", label: "Our Story" },
  { href: "/about/process",   label: "Our Process" },
  { href: "/about/team",      label: "Team" },
];

const SERVICE_LINKS = [
  { href: "/services/home-design",            label: "Home Design" },
  { href: "/services/complete-home-renovation", label: "Complete Home Renovation" },
  { href: "/services/kitchen",                label: "Kitchen Renovation" },
  { href: "/services/basement-finishing",     label: "Basement Finishing" },
  { href: "/services/drywall",                label: "Drywall" },
  { href: "/services/painting",               label: "Painting" },
  { href: "/services/flooring",               label: "Flooring" },
  { href: "/services/framing",                label: "Framing" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const isAbout = pathname.startsWith("/about");
  const isServices = pathname.startsWith("/services");

  return (
    <header className="bg-brand-black border-b border-brand-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-brand-yellow rounded-md flex items-center justify-center">
              <Hammer size={14} className="text-brand-black" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              Nova<span className="text-brand-yellow">reno</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">

            {/* About Us dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isAbout ? "text-white bg-brand-gray-800" : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-800"}`}>
                About Us <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-brand-gray-200 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 origin-top-left">
                {ABOUT_LINKS.map((l) => (
                  <Link key={l.href} href={l.href}
                    className="block px-4 py-2 text-sm text-brand-black hover:bg-brand-gray-100 hover:text-brand-yellow transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isServices ? "text-white bg-brand-gray-800" : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-800"}`}>
                Services <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-brand-gray-200 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 origin-top-left">
                {SERVICE_LINKS.map((l) => (
                  <Link key={l.href} href={l.href}
                    className="block px-4 py-2 text-sm text-brand-black hover:bg-brand-gray-100 hover:text-brand-yellow transition-colors">
                    {l.label}
                  </Link>
                ))}
                <div className="border-t border-brand-gray-200 mt-1 pt-1">
                  <Link href="/services"
                    className="block px-4 py-2 text-sm font-semibold text-brand-yellow hover:bg-brand-gray-100 transition-colors">
                    View All Services →
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/projects"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${pathname === "/projects" ? "text-white bg-brand-gray-800" : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-800"}`}>
              Projects
            </Link>

            <Link href="/calculator"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${pathname === "/calculator" ? "text-white bg-brand-gray-800" : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-800"}`}>
              Calculator
            </Link>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <a href={`tel:${BUSINESS.phone}`} className="hidden lg:flex items-center gap-1.5 text-brand-gray-400 hover:text-white text-sm transition-colors">
              <Phone size={13} />{BUSINESS.phone}
            </a>
            <Link href="/calculator"
              className="hidden sm:block bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold text-sm px-4 py-1.5 rounded-lg transition-colors">
              Free Quote
            </Link>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 text-brand-gray-400 hover:text-white transition-colors">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-gray-800 bg-brand-black px-4 pb-4 space-y-1">
          {/* About */}
          <button onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-brand-gray-400 hover:text-white transition-colors">
            About Us <ChevronDown size={14} className={`transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileAboutOpen && (
            <div className="pl-4 space-y-0.5">
              {ABOUT_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm text-brand-gray-400 hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {/* Services */}
          <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-brand-gray-400 hover:text-white transition-colors">
            Services <ChevronDown size={14} className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileServicesOpen && (
            <div className="pl-4 space-y-0.5">
              {SERVICE_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm text-brand-gray-400 hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          <Link href="/projects" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-brand-gray-400 hover:text-white transition-colors">
            Projects
          </Link>
          <Link href="/calculator" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-brand-gray-400 hover:text-white transition-colors">
            Calculator
          </Link>
          <div className="pt-2">
            <Link href="/calculator" onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-brand-yellow text-brand-black font-bold text-sm px-4 py-2.5 rounded-lg">
              Free Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

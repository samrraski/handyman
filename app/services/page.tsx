import type { Metadata } from "next";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { SERVICES_CONFIG } from "@/lib/services-config";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Renovation Services in Calgary | Novareno",
  description:
    "Browse all renovation services by Novareno in Calgary, AB — kitchen renovations, basement finishing, drywall, painting, flooring, doors & windows, and handyman repairs. Free estimates.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Renovation Services in Calgary | Novareno",
    description: "Kitchen renovations, basement finishing, drywall, painting, flooring, and more in Calgary, AB. Get a free estimate from Novareno.",
    url: "/services",
  },
};
import {
  Layers, Paintbrush, LayoutGrid, DoorOpen, Wrench,
  ArrowRight, CheckCircle2, Hammer,
} from "lucide-react";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  drywall: Layers, painting: Paintbrush, flooring: LayoutGrid,
  "doors-windows": DoorOpen, handyman: Wrench,
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Header */}
      <section className="bg-brand-black py-14 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-3">Our Services</h1>
        <p className="text-brand-gray-400 text-lg max-w-xl mx-auto">
          Professional handyman and renovation services across {BUSINESS.area}.
          Use our free calculator to estimate any project.
        </p>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES_CONFIG.map((s) => {
            const Icon = SERVICE_ICONS[s.slug] ?? Wrench;
            return (
              <div key={s.slug} className="bg-brand-gray-100 rounded-2xl overflow-hidden border border-brand-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="w-10 h-10 bg-brand-yellow/15 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-brand-yellow" />
                  </div>
                  <h2 className="text-lg font-bold text-brand-black mb-1">{s.name}</h2>
                  <p className="text-brand-gray-600 text-sm mb-4">{s.tagline}</p>
                  <ul className="space-y-1.5 mb-5">
                    {s.includes.slice(0, 4).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-brand-gray-600">
                        <CheckCircle2 size={14} className="text-brand-yellow mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${s.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-black hover:text-brand-yellow transition-colors">
                    Learn more <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-black border-t border-brand-gray-800 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-brand-yellow rounded-md flex items-center justify-center">
            <Hammer size={12} className="text-brand-black" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-sm">{BUSINESS.name}</span>
        </div>
        <p className="text-brand-gray-600 text-sm">{BUSINESS.area} · {BUSINESS.phone}</p>
      </footer>
    </div>
  );
}

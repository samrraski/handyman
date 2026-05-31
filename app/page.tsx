import type { Metadata } from "next";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { SERVICES_CONFIG } from "@/lib/services-config";
import { BUSINESS } from "@/lib/config";
import {
  Layers, Paintbrush, LayoutGrid, HardHat, DoorOpen, Wrench,
  ArrowRight, Calculator, CheckCircle2, Phone, Star,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Novareno | Calgary's #1 Renovation Contractor",
  description:
    "Novareno offers professional home renovation services in Calgary, AB — kitchen renovations, basement finishing, drywall, painting, flooring, framing, and complete home renovations. Get a free estimate today.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Novareno | Calgary's #1 Renovation Contractor",
    description:
      "Professional renovation services in Calgary — kitchens, basements, drywall, painting, flooring & more. Free estimates. Serving Calgary and Southern Alberta.",
    url: "/",
  },
};

const SERVICE_ICONS: Record<string, React.ElementType> = {
  drywall: Layers, painting: Paintbrush, flooring: LayoutGrid,
  framing: HardHat, "doors-windows": DoorOpen, handyman: Wrench,
};

const whyUs = [
  { icon: CheckCircle2, title: "Accurate Estimates Upfront",   desc: "Use our free calculator to know the cost before we even show up. No surprises." },
  { icon: Star,          title: "Quality Work, Every Time",    desc: "We take pride in clean, professional results — whether it's one wall or a full basement." },
  { icon: Phone,         title: "Fast Response",               desc: "Submit an inquiry and we'll get back to you within 24 hours to book your project." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-brand-black py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/20 rounded-full px-3 py-1 mb-6">
            <span className="text-brand-yellow text-xs font-semibold">{BUSINESS.area}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
            Transforming Calgary Homes
            <br />
            <span className="text-brand-yellow">with Excellence</span>
          </h1>
          <p className="text-brand-gray-400 text-lg max-w-xl mx-auto mb-8">
            We design and build beautiful living spaces through expert renovations,
            premium finishes, and meticulous attention to detail. Your dream home starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculator"
              className="inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold px-7 py-3.5 rounded-xl transition-colors text-base">
              <Calculator size={18} /> Get a Free Estimate
            </Link>
            <Link href="/services"
              className="inline-flex items-center justify-center gap-2 border border-brand-gray-700 hover:border-white text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-base">
              View Our Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-brand-black mb-3">What we do</h2>
            <p className="text-brand-gray-600">Click any service to learn more and get an estimate.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SERVICES_CONFIG.map((s) => {
              const Icon = SERVICE_ICONS[s.slug] ?? Wrench;
              return (
                <Link key={s.slug} href={`/services/${s.slug}`}
                  className="group bg-brand-gray-100 hover:bg-brand-black rounded-2xl p-5 flex flex-col items-center gap-3 text-center transition-all border border-transparent hover:border-brand-yellow">
                  <div className="w-10 h-10 bg-white group-hover:bg-brand-yellow rounded-xl flex items-center justify-center shadow-sm transition-colors">
                    <Icon size={20} className="text-brand-black transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-brand-black group-hover:text-white transition-colors">{s.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Calculator CTA ────────────────────────────────────── */}
      <section className="bg-brand-gray-100 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-black rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="text-brand-yellow text-sm font-semibold mb-2">Free Tool</div>
              <h2 className="text-3xl font-extrabold text-white mb-3">
                Know the cost before you call
              </h2>
              <p className="text-brand-gray-400 leading-relaxed mb-6">
                Use our free estimate calculator to get an accurate material and labour
                breakdown for your project — instantly, no signup required.
              </p>
              <Link href="/calculator"
                className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold px-6 py-3 rounded-xl transition-colors">
                <Calculator size={17} /> Open Calculator <ChevronRight size={16} />
              </Link>
            </div>
            <div className="hidden sm:flex w-48 h-48 bg-brand-gray-900 rounded-2xl items-center justify-center shrink-0">
              <Calculator size={64} className="text-brand-yellow opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-brand-black mb-3">Why choose us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-brand-yellow" />
                </div>
                <h3 className="font-bold text-brand-black mb-2">{title}</h3>
                <p className="text-brand-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-brand-yellow py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-brand-black mb-3">
            Ready to start your project?
          </h2>
          <p className="text-brand-black/70 text-lg mb-8">
            Get a free estimate in minutes — then send us your request and we&apos;ll be in touch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculator"
              className="inline-flex items-center justify-center gap-2 bg-brand-black hover:bg-brand-gray-900 text-white font-bold px-7 py-3.5 rounded-xl transition-colors">
              Get Free Estimate <ArrowRight size={17} />
            </Link>
            <a href={`tel:${BUSINESS.phone}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-brand-black text-brand-black font-bold px-7 py-3.5 rounded-xl hover:bg-black/5 transition-colors">
              <Phone size={17} /> Call Us Now
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

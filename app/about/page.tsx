import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { getContent } from "@/lib/content";
import { ArrowRight, Star, Shield, Clock, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Novareno | Calgary Renovation Contractor",
  description: "Learn about Novareno — Calgary's trusted renovation contractor. Over 300 completed projects, certified tradespeople, and a commitment to quality craftsmanship.",
};

const VALUES = [
  { icon: Star,   title: "Quality First",       desc: "We never cut corners. Every project is finished to the highest standard." },
  { icon: Shield, title: "Fully Licensed",       desc: "Fully insured, WCB covered, and compliant with all Alberta building codes." },
  { icon: Clock,  title: "On Time, Every Time",  desc: "We respect your schedule and communicate clearly about timelines." },
  { icon: Users,  title: "Your Team",            desc: "The same crew starts and finishes your project — no surprise subcontractors." },
];

export default async function AboutPage() {
  const c = await getContent(["about_headline", "about_text", "about_mission"]);

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="relative h-80 sm:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
          alt="Modern home renovation by Novareno Calgary"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-brand-black/65" />
        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 max-w-4xl mx-auto">
          <p className="text-brand-yellow text-sm font-semibold mb-2 uppercase tracking-widest">About Us</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">{c.about_headline}</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-gray-600 text-lg leading-relaxed mb-6">{c.about_text}</p>
            <p className="text-brand-gray-600 leading-relaxed mb-8">{c.about_mission}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/about/our-story"
                className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                Our Story <ArrowRight size={15} />
              </Link>
              <Link href="/about/team"
                className="flex items-center gap-2 border border-brand-gray-200 hover:border-brand-yellow text-brand-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                Meet the Team
              </Link>
            </div>
          </div>
          <div className="relative h-72 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
              alt="Novareno construction team at work in Calgary"
              fill className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-black py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "300+", label: "Projects Completed" },
            { value: "6+",   label: "Years in Business" },
            { value: "98%",  label: "Client Satisfaction" },
            { value: "12",   label: "Trade Specialists" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-brand-yellow mb-1">{s.value}</p>
              <p className="text-brand-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-black mb-8 text-center">Why homeowners choose Novareno</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 bg-brand-gray-100 rounded-2xl border border-brand-gray-200">
                <div className="w-10 h-10 bg-brand-yellow/15 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-brand-yellow" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-1">{title}</h3>
                  <p className="text-brand-gray-600 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-page links */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/about/our-story", label: "Our Story",   desc: "How Novareno was built from the ground up" },
            { href: "/about/process",   label: "Our Process", desc: "What to expect from start to finish" },
            { href: "/about/team",      label: "Our Team",    desc: "Meet the people behind every project" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="group p-5 bg-white border border-brand-gray-200 rounded-2xl hover:border-brand-yellow transition-colors">
              <h3 className="font-bold text-brand-black mb-1 group-hover:text-brand-yellow transition-colors">{item.label}</h3>
              <p className="text-brand-gray-600 text-sm">{item.desc}</p>
              <ArrowRight size={15} className="mt-3 text-brand-gray-400 group-hover:text-brand-yellow transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

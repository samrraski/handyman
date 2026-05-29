import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Renovation Process | Novareno Calgary",
  description: "Novareno's proven 6-step renovation process — from free consultation to final walkthrough. Transparent, stress-free renovations in Calgary.",
};

const STEPS = [
  {
    num: "01",
    title: "Free Consultation",
    desc: "We visit your home, listen to your vision, and assess the scope of work. No obligation, no pressure — just an honest conversation.",
    detail: "We'll discuss your goals, timeline, and budget so we can tailor the right approach from day one.",
  },
  {
    num: "02",
    title: "Detailed Quote",
    desc: "Within 48 hours you receive a clear, itemized quote — no surprises, no hidden fees.",
    detail: "Every line item is explained so you know exactly what you're paying for and why.",
  },
  {
    num: "03",
    title: "Design & Planning",
    desc: "We finalize materials, finishes, and the project schedule together before any work begins.",
    detail: "Our design team helps with selections, sourcing, and permit applications if required.",
  },
  {
    num: "04",
    title: "Construction",
    desc: "Our crew gets to work. You receive regular progress updates and have a direct line to your project lead.",
    detail: "We keep a clean, organized jobsite and respect your home throughout the process.",
  },
  {
    num: "05",
    title: "Quality Inspection",
    desc: "Before we call it done, we do a detailed internal inspection against our quality checklist.",
    detail: "Nothing leaves our list unchecked — we catch and fix issues before you ever see them.",
  },
  {
    num: "06",
    title: "Final Walkthrough",
    desc: "We walk through the completed project with you and address anything that isn't exactly right.",
    detail: "We don't consider a job finished until you're completely satisfied. Simple as that.",
  },
];

export default async function ProcessPage() {
  const c = await getContent(["process_intro"]);

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-brand-black py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-yellow text-sm font-semibold mb-2 uppercase tracking-widest">How We Work</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Our Process</h1>
          <p className="text-brand-gray-400 text-lg">{c.process_intro}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex gap-5 p-6 bg-white border border-brand-gray-200 rounded-2xl hover:border-brand-yellow transition-colors">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-xl bg-brand-yellow/15 flex items-center justify-center">
                  <span className="text-brand-yellow font-extrabold text-lg">{step.num}</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-brand-black text-lg mb-1">{step.title}</h3>
                <p className="text-brand-gray-600 mb-2">{step.desc}</p>
                <p className="text-brand-gray-400 text-sm">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo banner */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-3xl mx-auto relative h-64 rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80"
            alt="Novareno team completing a renovation project in Calgary"
            fill className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-white font-bold text-xl mb-3">Ready to get started?</p>
              <Link href="/calculator"
                className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

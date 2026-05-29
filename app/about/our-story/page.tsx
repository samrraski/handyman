import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story | Novareno Calgary Renovation",
  description: "Learn how Novareno was founded — a Calgary renovation company built on a passion for quality craftsmanship and treating every client like family.",
};

const MILESTONES = [
  { year: "2018", title: "Founded in Calgary", desc: "Novareno started with a two-person crew and a commitment to doing things right." },
  { year: "2019", title: "First 50 Projects", desc: "Word spread fast. By end of year two, we'd completed 50 homes across Calgary." },
  { year: "2021", title: "Expanded to Full Renovations", desc: "We grew our team to handle complete home renovations from design to finish." },
  { year: "2023", title: "300+ Projects Completed", desc: "Proud to have transformed over 300 homes across Calgary and the surrounding area." },
  { year: "Today", title: "Still Growing, Same Values", desc: "Bigger team, same dedication. Every project still gets our full attention." },
];

export default async function OurStoryPage() {
  const c = await getContent(["story_headline", "story_text"]);

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="relative h-72 sm:h-88 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80"
          alt="Novareno renovation project — before and after"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-brand-black/70" />
        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 max-w-3xl mx-auto">
          <p className="text-brand-yellow text-sm font-semibold mb-2 uppercase tracking-widest">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{c.story_headline}</h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3 prose prose-gray max-w-none">
              <p className="text-lg text-brand-gray-600 leading-relaxed mb-6">{c.story_text}</p>
              <p className="text-brand-gray-600 leading-relaxed mb-6">
                We believe a great renovation does more than update a home — it improves how you live in it.
                That&apos;s why we take time to understand exactly what each client wants, and we stay in constant
                communication from the first call to the final walkthrough.
              </p>
              <p className="text-brand-gray-600 leading-relaxed">
                Today, Novareno employs a team of 12 certified tradespeople and has completed over 300 projects
                across Calgary. But we haven&apos;t changed what matters most: every single job gets our full effort,
                and we don&apos;t consider a project done until you&apos;re thrilled with the result.
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80"
                  alt="Novareno team working on a Calgary renovation project"
                  fill className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 px-4 sm:px-6 bg-brand-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-brand-black mb-8">Our journey</h2>
          <div className="space-y-0">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center shrink-0">
                    <span className="text-brand-black font-bold text-xs">{m.year.slice(-2)}</span>
                  </div>
                  {i < MILESTONES.length - 1 && <div className="w-0.5 flex-1 bg-brand-gray-200 my-1" />}
                </div>
                <div className="pb-8">
                  <p className="text-brand-yellow text-xs font-semibold mb-0.5">{m.year}</p>
                  <h3 className="font-bold text-brand-black mb-1">{m.title}</h3>
                  <p className="text-brand-gray-600 text-sm">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 sm:px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-black mb-3">Ready to start your project?</h2>
          <p className="text-brand-gray-600 mb-6">Get a free estimate — no obligation, no pressure.</p>
          <Link href="/calculator"
            className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold px-7 py-3 rounded-xl text-sm transition-colors">
            Get a Free Quote
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

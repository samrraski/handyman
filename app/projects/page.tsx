import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Projects | Novareno Calgary Renovation Portfolio",
  description: "Browse Novareno's renovation portfolio — kitchen remodels, basement finishing, complete home renovations, and more across Calgary, AB.",
};

const PROJECTS = [
  {
    id: 1,
    title: "Modern Kitchen Renovation",
    location: "Tuscany, Calgary",
    type: "Kitchen",
    description: "Full kitchen gut and rebuild — new cabinets, quartz counters, tile backsplash, and LVP flooring throughout.",
    photo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    duration: "3 weeks",
  },
  {
    id: 2,
    title: "Basement Suite Finishing",
    location: "Cranston, Calgary",
    type: "Basement",
    description: "Legal basement suite — framing, drywall, bathroom, kitchen rough-in, flooring, and full paint.",
    photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    duration: "5 weeks",
  },
  {
    id: 3,
    title: "Open-Concept Living Space",
    location: "Hillhurst, Calgary",
    type: "Full Renovation",
    description: "Removed load-bearing wall to open kitchen/living room. New flooring, drywall, painting, and trim throughout.",
    photo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    duration: "4 weeks",
  },
  {
    id: 4,
    title: "Master Bathroom Refresh",
    location: "Signal Hill, Calgary",
    type: "Bathroom",
    description: "Complete tile replacement, new vanity, frameless glass shower, and fresh paint.",
    photo: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    duration: "2 weeks",
  },
  {
    id: 5,
    title: "Whole-Home LVP Flooring",
    location: "Shawnessy, Calgary",
    type: "Flooring",
    description: "1,800 sq ft of LVP throughout the main floor and upstairs, including stair nosing and all transitions.",
    photo: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    duration: "1 week",
  },
  {
    id: 6,
    title: "Interior Paint & Trim",
    location: "Silverado, Calgary",
    type: "Painting",
    description: "Full interior repaint of a 2,200 sq ft home. All walls, ceilings, trim, doors, and closets.",
    photo: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
    duration: "1 week",
  },
  {
    id: 7,
    title: "New Home Drywall Package",
    location: "Mahogany, Calgary",
    type: "Drywall",
    description: "Full drywall package for a new 2,500 sq ft home — hang, tape, mud, sand, prime, ready for paint.",
    photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    duration: "2 weeks",
  },
  {
    id: 8,
    title: "Basement Home Theatre",
    location: "Cougar Ridge, Calgary",
    type: "Basement",
    description: "Custom basement theatre room with acoustic drywall, built-in entertainment wall, bar area, and carpet.",
    photo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    duration: "4 weeks",
  },
  {
    id: 9,
    title: "Kitchen & Dining Expansion",
    location: "Bridgeland, Calgary",
    type: "Kitchen",
    description: "Wall removal, kitchen extension into dining room, full cabinet install, island addition, and flooring.",
    photo: "https://images.unsplash.com/photo-1556909048-f130f2f0d6a7?w=800&q=80",
    duration: "5 weeks",
  },
];

export default async function ProjectsPage() {
  const c = await getContent(["projects_headline", "projects_subtext"]);

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-brand-black py-16 px-4 sm:px-6 text-center">
        <p className="text-brand-yellow text-sm font-semibold mb-2 uppercase tracking-widest">Portfolio</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{c.projects_headline}</h1>
        <p className="text-brand-gray-400 max-w-xl mx-auto">{c.projects_subtext}</p>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-yellow py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-brand-black text-sm font-semibold">
          <span>300+ Projects Completed</span>
          <span>·</span>
          <span>Calgary & Area</span>
          <span>·</span>
          <span>6+ Years Experience</span>
          <span>·</span>
          <span>98% Satisfaction Rate</span>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <div key={project.id} className="bg-white border border-brand-gray-200 rounded-2xl overflow-hidden hover:border-brand-yellow hover:shadow-lg transition-all group">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={project.photo}
                    alt={`${project.title} — Novareno Calgary`}
                    fill className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-brand-black/80 text-brand-yellow text-xs font-semibold px-2.5 py-1 rounded-full">
                      {project.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-brand-black mb-1">{project.title}</h3>
                  <p className="text-brand-yellow text-xs font-medium mb-2">{project.location} · {project.duration}</p>
                  <p className="text-brand-gray-600 text-sm leading-relaxed">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 sm:px-6 bg-brand-gray-100 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-black mb-3">Love what you see?</h2>
          <p className="text-brand-gray-600 mb-6">
            Get a free estimate for your project. We&apos;ll visit your home, discuss your vision, and give you a clear quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculator"
              className="inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
              Get a Free Quote
            </Link>
            <Link href="/services"
              className="inline-flex items-center justify-center gap-2 border border-brand-gray-200 hover:border-brand-yellow text-brand-black font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              View Our Services
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

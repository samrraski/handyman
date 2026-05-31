import type { Metadata } from "next";
import Image from "next/image";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Team | Novareno Calgary Renovation Contractors",
  description: "Meet the Novareno team — certified tradespeople with decades of combined experience renovating Calgary homes.",
};

const TEAM = [
  {
    name: "Marcus Reed",
    role: "Founder & Lead Contractor",
    bio: "Over 15 years of experience in residential renovation. Marcus built Novareno from the ground up on a foundation of quality and client trust.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    specialties: ["Project Management", "Basements", "Renovations"],
  },
  {
    name: "Jordan Steele",
    role: "Senior Carpenter & Finisher",
    bio: "Jordan's eye for detail makes him the go-to for trim work, custom built-ins, and any job where precision is everything.",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    specialties: ["Drywall", "Carpentry", "Finishing"],
  },
  {
    name: "Aiden Park",
    role: "Flooring & Tile Specialist",
    bio: "Aiden has installed over 200,000 sq ft of flooring across Calgary. His LVP, tile, and hardwood installs are consistently flawless.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    specialties: ["Flooring", "Tile", "Subfloor"],
  },
  {
    name: "Priya Nair",
    role: "Design Consultant",
    bio: "Priya brings every client's vision to life with material selections, space planning, and design coordination that turns ideas into beautiful spaces.",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    specialties: ["Interior Design", "Kitchen", "Selections"],
  },
  {
    name: "Derek Fowler",
    role: "Painting Specialist",
    bio: "Derek's prep work is legendary on the team. Clean edges, smooth walls, no drips — he's been painting homes for 12 years.",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    specialties: ["Painting", "Priming", "Colour Consulting"],
  },
  {
    name: "Liam Torres",
    role: "Site Supervisor",
    bio: "Liam keeps every project on schedule and the jobsite running smoothly. Your project lead and main point of contact during construction.",
    photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80",
    specialties: ["Scheduling", "Quality Control", "Client Comm."],
  },
];

export default async function TeamPage() {
  const c = await getContent(["team_headline", "team_text"]);

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="relative h-64 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=80"
          alt="The Novareno renovation team"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-brand-black/65" />
        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 max-w-4xl mx-auto">
          <p className="text-brand-yellow text-sm font-semibold mb-2 uppercase tracking-widest">Our People</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{c.team_headline}</h1>
          <p className="text-brand-gray-300 mt-2">{c.team_text}</p>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <div key={member.name} className="bg-white border border-brand-gray-200 rounded-2xl overflow-hidden hover:border-brand-yellow transition-colors group">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={member.photo}
                  alt={`${member.name} — ${member.role} at Novareno Calgary`}
                  fill className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-brand-black text-lg">{member.name}</h3>
                <p className="text-brand-yellow text-sm font-medium mb-2">{member.role}</p>
                <p className="text-brand-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.specialties.map((s) => (
                    <span key={s} className="text-xs bg-brand-gray-100 text-brand-gray-600 px-2.5 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-12 px-4 sm:px-6 bg-brand-black text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">Join the Novareno team</h2>
          <p className="text-brand-gray-400 mb-6">We&apos;re always looking for skilled tradespeople who share our values.</p>
          <a href={`mailto:info@novareno.ca?subject=Career Inquiry`}
            className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Send Us Your Resume
          </a>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

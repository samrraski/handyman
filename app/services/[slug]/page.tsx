import { notFound } from "next/navigation";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { SERVICES_CONFIG } from "@/lib/services-config";
import { BUSINESS } from "@/lib/config";
import Image from "next/image";
import PublicFooter from "@/components/PublicFooter";
import {
  Layers, Paintbrush, LayoutGrid, HardHat, DoorOpen, Wrench,
  CheckCircle2, Calculator, Hammer, Home, ChefHat, Drill,
} from "lucide-react";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  drywall: Layers, painting: Paintbrush, flooring: LayoutGrid,
  framing: HardHat, "doors-windows": DoorOpen, handyman: Wrench,
  "home-design": Home, "complete-home-renovation": Hammer,
  kitchen: ChefHat, "basement-finishing": Drill,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<import("next").Metadata> {
  const { slug } = await params;
  const service = SERVICES_CONFIG.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };

  const title = `${service.name} in Calgary | Novareno`;
  const description = `Professional ${service.name.toLowerCase()} services in Calgary, AB. ${service.tagline}. Free estimates — serving Calgary, Airdrie, Cochrane, Okotoks, and all of Southern Alberta.`;

  return {
    title,
    description,
    keywords: [
      `${service.name.toLowerCase()} Calgary`,
      `Calgary ${service.name.toLowerCase()} contractor`,
      `${service.name.toLowerCase()} contractor Calgary AB`,
      `${service.name.toLowerCase()} company Calgary`,
    ],
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title,
      description,
      url: `/services/${slug}`,
      images: service.image ? [{ url: service.image, width: 1200, height: 630, alt: `${service.name} by Novareno Calgary` }] : [],
    },
  };
}

export function generateStaticParams() {
  return SERVICES_CONFIG.map((s) => ({ slug: s.slug }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES_CONFIG.find((s) => s.slug === slug);
  if (!service) notFound();

  const Icon = SERVICE_ICONS[slug] ?? Wrench;
  const otherServices = SERVICES_CONFIG.filter((s) => s.slug !== slug);

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="relative h-72 overflow-hidden">
        {service.image ? (
          <>
            <Image src={service.image} alt={`${service.name} service by Novareno Calgary`} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-brand-black/65" />
          </>
        ) : (
          <div className="absolute inset-0 bg-brand-black" />
        )}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 max-w-4xl mx-auto gap-5">
          <div className="w-14 h-14 bg-brand-yellow rounded-2xl flex items-center justify-center shrink-0">
            <Icon size={28} className="text-brand-black" />
          </div>
          <div>
            <p className="text-brand-yellow text-sm font-semibold mb-1">Our Services</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{service.name}</h1>
            <p className="text-brand-gray-300 mt-1">{service.tagline}</p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: description + includes */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-brand-black mb-3">About this service</h2>
              <p className="text-brand-gray-600 leading-relaxed">{service.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-black mb-3">What&apos;s included</h2>
              <ul className="space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-brand-yellow mt-0.5 shrink-0" />
                    <span className="text-brand-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: CTA card */}
          <div className="space-y-4">
            <div className="bg-brand-black rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Get a free estimate</h3>
              {service.calculatorId ? (
                <>
                  <p className="text-brand-gray-400 text-sm mb-4">
                    Use our calculator to get an instant price for your {service.name.toLowerCase()} project.
                  </p>
                  <Link
                    href={`/calculator?service=${service.calculatorId}`}
                    className="flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold px-5 py-2.5 rounded-xl transition-colors text-sm w-full"
                  >
                    <Calculator size={16} /> Open Calculator
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-brand-gray-400 text-sm mb-4">
                    Contact us for a free in-home consultation and personalized quote.
                  </p>
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    className="flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold px-5 py-2.5 rounded-xl transition-colors text-sm w-full"
                  >
                    Call for a Free Quote
                  </a>
                </>
              )}
            </div>

            <div className="bg-brand-gray-100 rounded-2xl p-6 border border-brand-gray-200">
              <h3 className="font-bold text-brand-black mb-1">Prefer to call?</h3>
              <p className="text-brand-gray-600 text-sm mb-3">We&apos;re happy to discuss your project.</p>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex items-center justify-center gap-2 border border-brand-gray-300 hover:border-brand-black text-brand-black font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm w-full"
              >
                {BUSINESS.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="bg-brand-gray-100 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-brand-black mb-5">Other services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {otherServices.map((s) => {
              const OtherIcon = SERVICE_ICONS[s.slug] ?? Wrench;
              return (
                <Link key={s.slug} href={`/services/${s.slug}`}
                  className="bg-white rounded-xl p-4 flex items-center gap-3 hover:border-brand-yellow border border-brand-gray-200 transition-colors">
                  <OtherIcon size={16} className="text-brand-gray-600 shrink-0" />
                  <span className="text-sm font-medium text-brand-black">{s.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

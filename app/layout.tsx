import type { Metadata } from "next";
import "./globals.css";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.siteUrl),
  title: {
    default: "Novareno | Calgary Renovation Contractor",
    template: "%s | Novareno Calgary",
  },
  description:
    "Novareno is Calgary's trusted renovation contractor. Kitchen renovations, basement finishing, drywall, painting, flooring, and complete home renovations. Serving Calgary and Southern Alberta.",
  keywords: [
    "Calgary renovation contractor",
    "home renovation Calgary",
    "basement finishing Calgary",
    "kitchen renovation Calgary",
    "drywall contractor Calgary",
    "painting contractor Calgary",
    "flooring installation Calgary",
    "Calgary general contractor",
    "renovation company Calgary AB",
    "Novareno",
  ],
  authors: [{ name: "Novareno" }],
  creator: "Novareno",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Novareno",
    title: "Novareno | Calgary Renovation Contractor",
    description:
      "Calgary's trusted renovation contractor — kitchens, basements, drywall, painting, flooring, and complete home renovations. Free estimates available.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Novareno Calgary renovation contractor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Novareno | Calgary Renovation Contractor",
    description:
      "Calgary's trusted renovation contractor — kitchens, basements, drywall, painting, flooring, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
  name: "Novareno",
  description:
    "Calgary's trusted renovation contractor specializing in kitchen renovations, basement finishing, drywall, painting, flooring, and complete home renovations.",
  url: BUSINESS.siteUrl,
  telephone: `+1-${BUSINESS.phone}`,
  email: BUSINESS.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calgary",
    addressRegion: "AB",
    postalCode: "T2P",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "51.0447",
    longitude: "-114.0719",
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: "51.0447",
      longitude: "-114.0719",
    },
    geoRadius: "200000",
  },
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "16:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Renovation Services",
    itemListElement: [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Kitchen Renovation", "areaServed": "Calgary, AB" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Basement Finishing", "areaServed": "Calgary, AB" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Complete Home Renovation", "areaServed": "Calgary, AB" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Drywall Installation", "areaServed": "Calgary, AB" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Interior Painting", "areaServed": "Calgary, AB" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flooring Installation", "areaServed": "Calgary, AB" } },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import { MetadataRoute } from "next";
import { SERVICES_CONFIG } from "@/lib/services-config";
import { BUSINESS } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BUSINESS.siteUrl;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,                lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/services`,        lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/calculator`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/projects`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about/our-story`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about/process`,   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about/team`,      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const servicePages: MetadataRoute.Sitemap = SERVICES_CONFIG.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticPages, ...servicePages];
}

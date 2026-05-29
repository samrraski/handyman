import { createClient } from "@/lib/supabase/server";

export const CONTENT_DEFAULTS: Record<string, string> = {
  hero_title: "Calgary's Most Trusted Renovation Contractor",
  hero_subtitle: "Quality craftsmanship, transparent pricing, and results you'll love — guaranteed.",
  hero_cta: "Get a Free Quote",
  about_headline: "Built on Craftsmanship, Driven by Quality",
  about_text: "Novareno has been transforming Calgary homes for over 6 years. What started as a small crew with a passion for quality work has grown into one of Calgary's most trusted renovation companies.",
  about_mission: "Our mission is simple: deliver exceptional renovations that stand the test of time, at prices that are fair and transparent.",
  story_headline: "How Novareno Started",
  story_text: "Novareno was founded in 2018 by a team of experienced tradespeople who were tired of seeing homeowners get burned by unreliable contractors. We built our company on a simple principle: treat every home like it's our own. Since then, we've completed over 300 renovation projects across Calgary and the surrounding area.",
  process_intro: "We make renovation simple, transparent, and stress-free with our proven 6-step process.",
  team_headline: "Meet the Novareno Team",
  team_text: "Our team of certified tradespeople brings decades of combined experience to every project.",
  projects_headline: "Our Work Speaks for Itself",
  projects_subtext: "Browse our portfolio of completed renovations across Calgary and the surrounding area.",
  contact_tagline: "Ready to transform your home?",
};

export async function getContent(keys: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  keys.forEach((k) => { result[k] = CONTENT_DEFAULTS[k] ?? ""; });

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_content")
      .select("key, value")
      .in("key", keys);
    data?.forEach((item) => {
      if (item.value) result[item.key] = item.value;
    });
  } catch {
    // fall back to defaults silently
  }

  return result;
}

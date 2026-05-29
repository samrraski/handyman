import { createClient } from "@/lib/supabase/server";
import { CONTENT_DEFAULTS } from "@/lib/content";
import ContentView from "./ContentView";

const CONTENT_META: Record<string, { label: string; section: string }> = {
  hero_title:       { label: "Hero Title",        section: "home"    },
  hero_subtitle:    { label: "Hero Subtitle",      section: "home"    },
  hero_cta:         { label: "Hero Button Text",   section: "home"    },
  about_headline:   { label: "About Headline",     section: "about"   },
  about_text:       { label: "About Text",         section: "about"   },
  about_mission:    { label: "About Mission",      section: "about"   },
  story_headline:   { label: "Story Headline",     section: "about"   },
  story_text:       { label: "Story Text",         section: "about"   },
  process_intro:    { label: "Process Intro",      section: "about"   },
  team_headline:    { label: "Team Headline",      section: "about"   },
  team_text:        { label: "Team Text",          section: "about"   },
  projects_headline:{ label: "Projects Headline",  section: "projects"},
  projects_subtext: { label: "Projects Subtext",   section: "projects"},
  contact_tagline:  { label: "Contact Tagline",    section: "contact" },
};

export default async function ContentPage() {
  const supabase = await createClient();

  // Fetch saved content from DB
  const { data: saved } = await supabase
    .from("site_content")
    .select("key, value");

  const savedMap: Record<string, string> = {};
  saved?.forEach((row) => { savedMap[row.key] = row.value; });

  // Merge with defaults + meta
  const items = Object.entries(CONTENT_META).map(([key, meta]) => ({
    key,
    value: savedMap[key] ?? CONTENT_DEFAULTS[key] ?? "",
    label: meta.label,
    section: meta.section,
  }));

  return <ContentView initialItems={items} />;
}

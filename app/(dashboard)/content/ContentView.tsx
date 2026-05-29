"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

interface ContentItem {
  key: string;
  value: string;
  label: string;
  section: string;
}

const SECTION_LABELS: Record<string, string> = {
  home: "Home Page",
  about: "About Pages",
  projects: "Projects Page",
  contact: "Contact & General",
};

const TEXTAREA_KEYS = ["hero_subtitle", "about_text", "about_mission", "story_text", "process_intro", "team_text", "projects_subtext"];

export default function ContentView({ initialItems }: { initialItems: ContentItem[] }) {
  const [items, setItems] = useState<ContentItem[]>(initialItems);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const grouped = Object.keys(SECTION_LABELS).reduce((acc, section) => {
    acc[section] = items.filter((i) => i.section === section);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  function handleChange(key: string, value: string) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, value } : i)));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  async function handleSave(key: string) {
    const item = items.find((i) => i.key === key);
    if (!item) return;
    setSaving(key);
    const supabase = createClient();
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value: item.value, label: item.label, section: item.section });

    if (error) {
      setErrors((prev) => ({ ...prev, [key]: error.message }));
    } else {
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    }
    setSaving(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Content Management</h1>
        <p className="text-brand-gray-400 text-sm mt-1">
          Edit the text content shown on your public website. Changes go live immediately after saving.
        </p>
      </div>

      {Object.entries(SECTION_LABELS).map(([section, sectionLabel]) => {
        const sectionItems = grouped[section] ?? [];
        if (sectionItems.length === 0) return null;

        return (
          <div key={section} className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-gray-200 bg-brand-gray-100">
              <h2 className="font-semibold text-brand-black">{sectionLabel}</h2>
            </div>
            <div className="divide-y divide-brand-gray-200">
              {sectionItems.map((item) => {
                const isTextarea = TEXTAREA_KEYS.includes(item.key);
                const isSaving = saving === item.key;
                const isSaved = saved === item.key;
                const hasError = errors[item.key];

                return (
                  <div key={item.key} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">
                          {item.label}
                        </label>
                        {isTextarea ? (
                          <textarea
                            value={item.value}
                            onChange={(e) => handleChange(item.key, e.target.value)}
                            rows={3}
                            className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow transition-colors resize-y"
                          />
                        ) : (
                          <input
                            value={item.value}
                            onChange={(e) => handleChange(item.key, e.target.value)}
                            className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                          />
                        )}
                        {hasError && (
                          <p className="text-red-500 text-xs mt-1">{hasError}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleSave(item.key)}
                        disabled={!!isSaving}
                        className="shrink-0 flex items-center gap-1.5 mt-6 bg-brand-yellow hover:bg-brand-yellow-hover disabled:opacity-60 text-brand-black font-semibold text-xs px-3 py-2 rounded-lg transition-colors"
                      >
                        {isSaving ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : isSaved ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <Save size={13} />
                        )}
                        {isSaved ? "Saved!" : "Save"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

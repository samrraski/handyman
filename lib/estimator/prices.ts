import type { ServiceId } from "./types";

export type PriceMap = Record<string, number>;

export const DEFAULT_PRICES: PriceMap = {
  // Drywall
  drywall_regular:   18,
  drywall_moisture:  28,
  drywall_fire:      32,
  drywall_compound:  22,
  drywall_tape:       8,
  drywall_screws:     6,
  // Painting
  painting_standard:   45,
  painting_premium:    68,
  painting_primer:     35,
  painting_tape:        7,
  painting_roller_kit: 18,
  painting_drop_cloth: 12,
  // Flooring
  flooring_hardwood:     8.5,
  flooring_lvp:          4.5,
  flooring_laminate:     3.0,
  flooring_tile:         5.0,
  flooring_carpet:       3.5,
  flooring_underlayment: 0.5,
  // Doors & Windows
  door_interior:   280,
  door_exterior:   650,
  window_standard: 380,
  door_hardware:    45,
  door_foam_caulk:  12,
};

export interface ServiceMaterial {
  key: string;
  name: string;
  unit: string;
  defaultPrice: number;
}

export interface ServiceDef {
  id: ServiceId;
  label: string;
  materials: ServiceMaterial[];
}

export const SERVICE_DEFS: ServiceDef[] = [
  {
    id: "drywall",
    label: "Drywall",
    materials: [
      { key: "drywall_regular",  name: '1/2" Regular Drywall (4×8)',         unit: "sheet",  defaultPrice: 18 },
      { key: "drywall_moisture", name: '1/2" Moisture Resistant Drywall (4×8)', unit: "sheet", defaultPrice: 28 },
      { key: "drywall_fire",     name: '5/8" Fire-Rated Drywall (4×8)',       unit: "sheet",  defaultPrice: 32 },
      { key: "drywall_compound", name: "Joint Compound (4.5L bucket)",         unit: "bucket", defaultPrice: 22 },
      { key: "drywall_tape",     name: "Drywall Tape",                         unit: "roll",   defaultPrice: 8  },
      { key: "drywall_screws",   name: "Drywall Screws",                       unit: "box",    defaultPrice: 6  },
    ],
  },
  {
    id: "painting",
    label: "Painting",
    materials: [
      { key: "painting_standard",    name: "Standard Paint",       unit: "gallon", defaultPrice: 45 },
      { key: "painting_premium",     name: "Premium Paint",        unit: "gallon", defaultPrice: 68 },
      { key: "painting_primer",      name: "Primer",               unit: "gallon", defaultPrice: 35 },
      { key: "painting_tape",        name: "Painter's Tape",       unit: "roll",   defaultPrice: 7  },
      { key: "painting_roller_kit",  name: "Roller & Brush Kit",   unit: "kit",    defaultPrice: 18 },
      { key: "painting_drop_cloth",  name: "Drop Cloths",          unit: "set",    defaultPrice: 12 },
    ],
  },
  {
    id: "flooring",
    label: "Flooring",
    materials: [
      { key: "flooring_lvp",          name: "LVP / Vinyl Plank Flooring", unit: "sq ft", defaultPrice: 4.5 },
      { key: "flooring_laminate",     name: "Laminate Flooring",          unit: "sq ft", defaultPrice: 3.0 },
      { key: "flooring_hardwood",     name: "Hardwood Flooring",          unit: "sq ft", defaultPrice: 8.5 },
      { key: "flooring_tile",         name: "Ceramic Tile",               unit: "sq ft", defaultPrice: 5.0 },
      { key: "flooring_carpet",       name: "Carpet",                     unit: "sq ft", defaultPrice: 3.5 },
      { key: "flooring_underlayment", name: "Underlayment",               unit: "sq ft", defaultPrice: 0.5 },
    ],
  },
  {
    id: "doors_windows",
    label: "Doors & Windows",
    materials: [
      { key: "door_interior",   name: 'Interior Pre-hung Door (32")', unit: "unit", defaultPrice: 280 },
      { key: "door_exterior",   name: "Exterior Door (Insulated)",    unit: "unit", defaultPrice: 650 },
      { key: "window_standard", name: "Vinyl Window (Standard)",      unit: "unit", defaultPrice: 380 },
      { key: "door_hardware",   name: "Hardware & Fasteners",         unit: "set",  defaultPrice: 45  },
      { key: "door_foam_caulk", name: "Foam, Caulk & Shims",         unit: "set",  defaultPrice: 12  },
    ],
  },
  {
    id: "handyman",
    label: "Handyman",
    materials: [],
  },
];

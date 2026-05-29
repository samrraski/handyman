export interface ServiceConfig {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  includes: string[];
  calculatorId: string; // matches ServiceId in estimator
}

export const SERVICES_CONFIG: ServiceConfig[] = [
  {
    slug: "drywall",
    name: "Drywall",
    tagline: "Clean, straight walls — every time",
    description:
      "From basement finishing to full room renovations, we handle drywall installation, taping, mudding, and finishing to a smooth, paint-ready surface.",
    includes: [
      "Drywall hanging and fastening",
      "Taping, mudding, and sanding",
      "Ceiling installation",
      "Moisture-resistant drywall for bathrooms & kitchens",
      "Fire-rated drywall for garages",
      "Patch and repair work",
    ],
    calculatorId: "drywall",
  },
  {
    slug: "painting",
    name: "Painting",
    tagline: "Fresh coat, flawless finish",
    description:
      "Interior painting done right — walls, ceilings, trim, and more. We prep surfaces properly, use quality paints, and leave your space looking brand new.",
    includes: [
      "Interior wall and ceiling painting",
      "Surface preparation and priming",
      "Trim, baseboards, and doors",
      "Single room or whole house",
      "Standard and premium paint options",
      "Clean, tidy work — no mess left behind",
    ],
    calculatorId: "painting",
  },
  {
    slug: "flooring",
    name: "Flooring",
    tagline: "Beautiful floors, professionally installed",
    description:
      "LVP, laminate, hardwood, tile, or carpet — we install all flooring types with precision and care, including subfloor prep and transitions.",
    includes: [
      "LVP / vinyl plank installation",
      "Laminate flooring",
      "Hardwood installation",
      "Ceramic and porcelain tile",
      "Carpet installation",
      "Subfloor preparation and leveling",
    ],
    calculatorId: "flooring",
  },
  {
    slug: "framing",
    name: "Framing",
    tagline: "Solid structure, built right",
    description:
      "New walls, basement development, room additions — we build framing that everything else depends on, straight and to code.",
    includes: [
      "Interior wall framing",
      "Basement development framing",
      "Partition walls",
      "Door and window rough openings",
      "Structural framing",
      "Code-compliant construction",
    ],
    calculatorId: "framing",
  },
  {
    slug: "doors-windows",
    name: "Doors & Windows",
    tagline: "Installed right, sealed tight",
    description:
      "Interior door installation, exterior door replacement, window installs — proper fitting, weatherproofing, and a clean finish every time.",
    includes: [
      "Interior pre-hung door installation",
      "Exterior door replacement",
      "Window installation and replacement",
      "Hardware installation",
      "Weatherstripping and caulking",
      "Door frame repair",
    ],
    calculatorId: "doors_windows",
  },
  {
    slug: "handyman",
    name: "Handyman Repairs",
    tagline: "No job too small",
    description:
      "Got a list of things to fix? We handle all kinds of general repairs and small jobs quickly and professionally.",
    includes: [
      "Furniture assembly",
      "TV and shelf mounting",
      "Minor plumbing fixes",
      "Caulking and weathersealing",
      "Cabinet and hardware repairs",
      "General home maintenance",
    ],
    calculatorId: "handyman",
  },
];

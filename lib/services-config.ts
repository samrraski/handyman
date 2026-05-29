export interface ServiceConfig {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  includes: string[];
  calculatorId?: string; // optional — not all services have a calculator
  image?: string;        // Unsplash photo URL
}

export const SERVICES_CONFIG: ServiceConfig[] = [
  {
    slug: "home-design",
    name: "Home Design",
    tagline: "Your vision, brought to life",
    description:
      "Great renovations start with great design. Our in-house design team works closely with you to create floor plans, material selections, and 3D concepts that make your project a success before a single nail is driven.",
    includes: [
      "Free design consultation",
      "Floor plan and layout planning",
      "Material and finish selection",
      "3D concept renderings",
      "Budget planning and phasing",
      "Permit drawings and documentation",
    ],
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
  },
  {
    slug: "complete-home-renovation",
    name: "Complete Home Renovation",
    tagline: "From first nail to final coat",
    description:
      "Thinking bigger? We manage full home renovations from design to completion. One team, one contract, zero headaches. We coordinate every trade so you don't have to.",
    includes: [
      "Full project design and planning",
      "Structural framing and drywall",
      "Kitchen and bathroom renovation",
      "Flooring throughout",
      "Painting — interior and trim",
      "All finishing and cleanup",
    ],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
  },
  {
    slug: "kitchen",
    name: "Kitchen Renovation",
    tagline: "The heart of your home, reinvented",
    description:
      "Your kitchen should work as good as it looks. We handle everything from cabinetry and countertops to tile backsplashes, flooring, and full layout changes.",
    includes: [
      "Cabinet installation and refacing",
      "Countertop installation (quartz, granite, laminate)",
      "Tile backsplash",
      "Under-cabinet lighting",
      "Flooring installation",
      "Plumbing and electrical rough-in (with licensed sub-trades)",
    ],
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
  },
  {
    slug: "basement-finishing",
    name: "Basement Finishing",
    tagline: "Turn unused space into your favourite room",
    description:
      "An unfinished basement is untapped potential. We transform concrete shells into beautiful living spaces — home theatres, gyms, rental suites, playrooms, and more.",
    includes: [
      "Framing and insulation",
      "Drywall and taping",
      "Drop ceiling or drywall ceiling",
      "Flooring (LVP, carpet, tile)",
      "Painting and trim",
      "Bathroom rough-in and finishing",
    ],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  },
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
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=1200&q=80",
  },
];

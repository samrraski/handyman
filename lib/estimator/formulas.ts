import type {
  Settings, EstimateResult, MaterialItem,
  DrywallInputs, PaintingInputs, FlooringInputs,
  FramingInputs, DoorsWindowsInputs, HandymanInputs,
} from "./types";
import { DEFAULT_PRICES, type PriceMap } from "./prices";

function p(prices: PriceMap, key: string): number {
  return prices[key] ?? DEFAULT_PRICES[key];
}

function buildResult(
  materials: MaterialItem[],
  laborHours: number,
  settings: Settings
): EstimateResult {
  const materialCost = materials.reduce((sum, m) => sum + m.total, 0);
  const laborCost    = Math.round(laborHours * settings.laborRate * 100) / 100;
  const subtotal     = materialCost + laborCost;
  const profitAmount = Math.round(subtotal * (settings.profitMargin / 100) * 100) / 100;
  const taxableAmount = subtotal + profitAmount;
  const taxAmount    = Math.round(taxableAmount * (settings.taxRate / 100) * 100) / 100;
  const total        = taxableAmount + taxAmount;

  return {
    materials,
    laborHours:   Math.round(laborHours * 10) / 10,
    laborRate:    settings.laborRate,
    laborCost,
    materialCost: Math.round(materialCost * 100) / 100,
    subtotal:     Math.round(subtotal * 100) / 100,
    profitMargin: settings.profitMargin,
    profitAmount,
    taxRate:      settings.taxRate,
    taxAmount,
    total:        Math.round(total * 100) / 100,
  };
}

export function calculateDrywall(
  inputs: DrywallInputs,
  settings: Settings,
  prices: PriceMap = {}
): EstimateResult {
  const { length, width, height, includeCeiling, wallCoverage, materialType } = inputs;
  const waste = 1 + settings.wastePercent / 100;

  const coverageFactor =
    wallCoverage === "all" ? 1 : wallCoverage === "three" ? 0.75 :
    wallCoverage === "two" ? 0.5 : 0.25;

  const wallArea    = 2 * (length + width) * height * coverageFactor;
  const ceilingArea = includeCeiling ? length * width : 0;
  const totalArea   = wallArea + ceilingArea;

  const sheetLabels = {
    regular:  '1/2" Regular Drywall (4×8)',
    moisture: '1/2" Moisture Resistant Drywall (4×8)',
    fire:     '5/8" Fire-Rated Drywall (4×8)',
  };

  const sheets   = Math.ceil((totalArea / 32) * waste);
  const compound = Math.max(1, Math.ceil(totalArea / 150));
  const tape     = Math.max(1, Math.ceil(totalArea / 50));
  const screws   = Math.max(1, Math.ceil(totalArea / 400));

  const sheetPrice    = p(prices, `drywall_${materialType}`);
  const compoundPrice = p(prices, "drywall_compound");
  const tapePrice     = p(prices, "drywall_tape");
  const screwPrice    = p(prices, "drywall_screws");

  const materials: MaterialItem[] = [
    { name: sheetLabels[materialType],        quantity: sheets,   unit: "sheets",  unitPrice: sheetPrice,    total: sheets   * sheetPrice    },
    { name: "Joint Compound (4.5L bucket)",   quantity: compound, unit: "buckets", unitPrice: compoundPrice, total: compound * compoundPrice },
    { name: "Drywall Tape",                   quantity: tape,     unit: "rolls",   unitPrice: tapePrice,     total: tape     * tapePrice     },
    { name: "Drywall Screws",                 quantity: screws,   unit: "boxes",   unitPrice: screwPrice,    total: screws   * screwPrice    },
  ];

  return buildResult(materials, totalArea / 35, settings);
}

export function calculatePainting(
  inputs: PaintingInputs,
  settings: Settings,
  prices: PriceMap = {}
): EstimateResult {
  const { length, width, height, includeCeiling, numCoats, includesPrimer, materialType } = inputs;
  const waste = 1 + settings.wastePercent / 100;

  const wallArea    = 2 * (length + width) * height;
  const ceilingArea = includeCeiling ? length * width : 0;
  const totalArea   = wallArea + ceilingArea;

  const coverage   = materialType === "standard" ? 350 : 400;
  const paintPrice = p(prices, `painting_${materialType}`);
  const gallons    = Math.max(1, Math.ceil((totalArea * numCoats / coverage) * waste));
  const roomSets   = Math.max(1, Math.ceil(totalArea / 500));

  const materials: MaterialItem[] = [
    { name: `${materialType === "standard" ? "Standard" : "Premium"} Paint`, quantity: gallons, unit: "gallons", unitPrice: paintPrice, total: gallons * paintPrice },
  ];

  if (includesPrimer) {
    const primerPrice   = p(prices, "painting_primer");
    const primerGallons = Math.max(1, Math.ceil((totalArea / 400) * waste));
    materials.push({ name: "Primer", quantity: primerGallons, unit: "gallons", unitPrice: primerPrice, total: primerGallons * primerPrice });
  }

  const tapePrice  = p(prices, "painting_tape");
  const rollerPrice = p(prices, "painting_roller_kit");
  const clothPrice  = p(prices, "painting_drop_cloth");
  materials.push(
    { name: "Painter's Tape",    quantity: roomSets * 2, unit: "rolls", unitPrice: tapePrice,   total: roomSets * 2 * tapePrice },
    { name: "Roller & Brush Kit", quantity: roomSets,   unit: "kits",  unitPrice: rollerPrice,  total: roomSets * rollerPrice   },
    { name: "Drop Cloths",        quantity: roomSets,   unit: "sets",  unitPrice: clothPrice,   total: roomSets * clothPrice    }
  );

  return buildResult(materials, totalArea / 100, settings);
}

export function calculateFlooring(
  inputs: FlooringInputs,
  settings: Settings,
  prices: PriceMap = {}
): EstimateResult {
  const { length, width, materialType, includeUnderlayment } = inputs;
  const waste = 1 + settings.wastePercent / 100;

  const area         = length * width;
  const materialArea = Math.ceil(area * waste);

  const flooringNames: Record<string, string> = {
    hardwood: "Hardwood Flooring", lvp: "LVP / Vinyl Plank Flooring",
    laminate: "Laminate Flooring",  tile: "Ceramic Tile", carpet: "Carpet",
  };
  const laborSqFtPerHour: Record<string, number> = {
    hardwood: 50, lvp: 80, laminate: 70, tile: 30, carpet: 90,
  };

  const flooringPrice = p(prices, `flooring_${materialType}`);
  const materials: MaterialItem[] = [
    { name: flooringNames[materialType], quantity: materialArea, unit: "sq ft", unitPrice: flooringPrice, total: materialArea * flooringPrice },
  ];

  if (includeUnderlayment && materialType !== "tile" && materialType !== "carpet") {
    const underlayPrice = p(prices, "flooring_underlayment");
    materials.push({ name: "Underlayment", quantity: materialArea, unit: "sq ft", unitPrice: underlayPrice, total: materialArea * underlayPrice });
  }

  const installCost = Math.ceil(area / 100) * 15;
  materials.push({ name: "Installation Materials (adhesive, nails, transitions)", quantity: 1, unit: "lot", unitPrice: installCost, total: installCost });

  return buildResult(materials, area / laborSqFtPerHour[materialType], settings);
}

export function calculateFraming(
  inputs: FramingInputs,
  settings: Settings,
  prices: PriceMap = {}
): EstimateResult {
  const { linearFeet, wallHeight, numberOfOpenings } = inputs;
  const waste = 1 + settings.wastePercent / 100;

  const studLength  = Math.ceil(wallHeight + 0.5);
  const totalStuds  = Math.ceil((linearFeet * 0.75 + numberOfOpenings * 4) * waste);
  const plateBoards = Math.ceil((linearFeet * 3 / 8) * waste);
  const nailBoxes   = Math.max(1, Math.ceil(linearFeet / 50));

  const studPrice  = p(prices, "framing_stud");
  const platePrice = p(prices, "framing_plate");
  const nailPrice  = p(prices, "framing_nails");

  const materials: MaterialItem[] = [
    { name: `2×4×${studLength} Studs`, quantity: totalStuds,  unit: "pieces", unitPrice: studPrice,  total: totalStuds  * studPrice  },
    { name: "2×4×8 Plates",           quantity: plateBoards, unit: "boards", unitPrice: platePrice, total: plateBoards * platePrice },
    { name: "Framing Nails",           quantity: nailBoxes,   unit: "boxes",  unitPrice: nailPrice,  total: nailBoxes   * nailPrice  },
  ];

  if (numberOfOpenings > 0) {
    const headerPrice = p(prices, "framing_header");
    const headers = numberOfOpenings * 2;
    materials.push({ name: "2×8 Header Boards", quantity: headers, unit: "boards", unitPrice: headerPrice, total: headers * headerPrice });
  }

  return buildResult(materials, linearFeet / 15, settings);
}

export function calculateDoorsWindows(
  inputs: DoorsWindowsInputs,
  settings: Settings,
  prices: PriceMap = {}
): EstimateResult {
  const { interiorDoors, exteriorDoors, windows } = inputs;
  const materials: MaterialItem[] = [];

  if (interiorDoors > 0) {
    const pp = p(prices, "door_interior");
    materials.push({ name: 'Interior Pre-hung Door (32")', quantity: interiorDoors, unit: "units", unitPrice: pp, total: interiorDoors * pp });
  }
  if (exteriorDoors > 0) {
    const pp = p(prices, "door_exterior");
    materials.push({ name: "Exterior Door (Insulated)", quantity: exteriorDoors, unit: "units", unitPrice: pp, total: exteriorDoors * pp });
  }
  if (windows > 0) {
    const pp = p(prices, "window_standard");
    materials.push({ name: "Vinyl Window (Standard)", quantity: windows, unit: "units", unitPrice: pp, total: windows * pp });
  }

  const totalUnits = interiorDoors + exteriorDoors + windows;
  if (totalUnits > 0) {
    const hwPrice    = p(prices, "door_hardware");
    const foamPrice  = p(prices, "door_foam_caulk");
    materials.push({ name: "Hardware & Fasteners", quantity: totalUnits, unit: "sets", unitPrice: hwPrice,   total: totalUnits * hwPrice   });
    materials.push({ name: "Foam, Caulk & Shims",  quantity: totalUnits, unit: "sets", unitPrice: foamPrice, total: totalUnits * foamPrice });
  }

  const laborHours = interiorDoors * 2 + exteriorDoors * 3.5 + windows * 3;
  return buildResult(materials, laborHours, settings);
}

export function calculateHandyman(
  inputs: HandymanInputs,
  settings: Settings,
  prices: PriceMap = {}
): EstimateResult {
  void prices;
  const { estimatedHours, materialBudget } = inputs;
  const materials: MaterialItem[] = materialBudget > 0
    ? [{ name: "Materials & Supplies", quantity: 1, unit: "lot", unitPrice: materialBudget, total: materialBudget }]
    : [];
  return buildResult(materials, estimatedHours, settings);
}

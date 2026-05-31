export type ServiceId =
  | "drywall"
  | "painting"
  | "flooring"
  | "doors_windows"
  | "handyman";

export interface MaterialItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface EstimateResult {
  materials: MaterialItem[];
  laborHours: number;
  laborRate: number;
  laborCost: number;
  materialCost: number;
  subtotal: number;
  profitMargin: number;
  profitAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface Settings {
  laborRate: number;
  wastePercent: number;
  profitMargin: number;
  taxRate: number;
}

export interface DrywallInputs {
  length: number;
  width: number;
  height: number;
  includeCeiling: boolean;
  wallCoverage: "all" | "three" | "two" | "one";
  materialType: "regular" | "moisture" | "fire";
}

export interface PaintingInputs {
  length: number;
  width: number;
  height: number;
  includeCeiling: boolean;
  numCoats: number;
  includesPrimer: boolean;
  materialType: "standard" | "premium";
}

export interface FlooringInputs {
  length: number;
  width: number;
  materialType: "hardwood" | "lvp" | "laminate" | "tile" | "carpet";
  includeUnderlayment: boolean;
}

export interface FramingInputs {
  linearFeet: number;
  wallHeight: number;
  numberOfOpenings: number;
}

export interface DoorsWindowsInputs {
  interiorDoors: number;
  exteriorDoors: number;
  windows: number;
}

export interface HandymanInputs {
  estimatedHours: number;
  materialBudget: number;
}

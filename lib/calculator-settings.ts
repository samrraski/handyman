import type { Settings } from "@/lib/estimator/types";

export const DEFAULT_CALCULATOR_SETTINGS: Settings = {
  laborRate: 65,
  wastePercent: 10,
  profitMargin: 20,
  taxRate: 5,
};

export type CalculatorSettingsRow = {
  labor_rate: number | null;
  waste_percent: number | null;
  tax_rate: number | null;
};

export function rowToCalculatorSettings(row?: CalculatorSettingsRow | null): Settings {
  return {
    ...DEFAULT_CALCULATOR_SETTINGS,
    laborRate: Number(row?.labor_rate ?? DEFAULT_CALCULATOR_SETTINGS.laborRate),
    wastePercent: Number(row?.waste_percent ?? DEFAULT_CALCULATOR_SETTINGS.wastePercent),
    taxRate: Number(row?.tax_rate ?? DEFAULT_CALCULATOR_SETTINGS.taxRate),
  };
}

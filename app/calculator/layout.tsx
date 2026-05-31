import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Renovation Cost Calculator | Novareno Calgary",
  description:
    "Use Novareno's free renovation calculator to get an instant estimate for drywall, painting, flooring, doors, windows, handyman repairs, and more in Calgary, AB. No obligation, no sign-up required.",
  keywords: [
    "renovation cost calculator Calgary",
    "free home renovation estimate Calgary",
    "drywall cost estimate Calgary",
    "painting cost calculator Calgary",
    "flooring cost estimate Calgary",
  ],
  alternates: { canonical: "/calculator" },
  openGraph: {
    title: "Free Renovation Cost Calculator | Novareno Calgary",
    description:
      "Get an instant renovation estimate for your Calgary home — drywall, painting, flooring, doors, windows, handyman repairs, and more. Free, no obligation.",
    url: "/calculator",
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

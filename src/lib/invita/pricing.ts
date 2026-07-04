import { SEED_SERVICES } from "@/lib/constants";
import { LIQUIVIDA_DRIPS } from "./liquivida-drips";

export function getDripPriceIqd(slug: string): number {
  const index = LIQUIVIDA_DRIPS.findIndex((d) => d.slug === slug);
  if (index === -1) return 150_000;
  return SEED_SERVICES[index]?.price ?? 150_000;
}

export function getDripPricingMap(): Record<string, number> {
  return Object.fromEntries(
    LIQUIVIDA_DRIPS.map((drip, index) => [
      drip.slug,
      SEED_SERVICES[index]?.price ?? 150_000,
    ])
  );
}

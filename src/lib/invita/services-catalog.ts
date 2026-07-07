import { LIQUIVIDA_DRIPS } from "./liquivida-drips";
import { SEED_SERVICES } from "@/lib/constants";
import type { Service } from "@/lib/supabase/types";

export function buildSeedService(index: number): Service | null {
  const drip = LIQUIVIDA_DRIPS[index];
  const seed = SEED_SERVICES[index];
  if (!drip || !seed) return null;

  const now = new Date().toISOString();
  return {
    id: `seed-${index + 1}`,
    name: seed.name,
    category: seed.category,
    duration: seed.duration,
    price: seed.price,
    description: seed.description,
    active: seed.active,
    slug: drip.slug,
    tier: drip.tier,
    image_url: `/images/invita/drips/${drip.imageSlug}.webp`,
    created_at: now,
    updated_at: now,
  } satisfies Service;
}

export function seedServicesCatalog(): Service[] {
  return LIQUIVIDA_DRIPS.map((_, index) => buildSeedService(index)).filter(
    (item): item is Service => item !== null
  );
}

export function enrichServiceRow(row: Service): Service {
  if (row.slug) return row;
  const byName = LIQUIVIDA_DRIPS.find((d) => d.name === row.name);
  if (!byName) return row;
  return {
    ...row,
    slug: byName.slug,
    tier: byName.tier,
    image_url: row.image_url ?? `/images/invita/drips/${byName.imageSlug}.webp`,
  };
}

export function resolveServiceBySlug(services: Service[], slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function resolveServiceBySeedOrSlug(
  services: Service[],
  dripSlug: string
): Service | undefined {
  const index = LIQUIVIDA_DRIPS.findIndex((d) => d.slug === dripSlug);
  if (index === -1) return undefined;

  return (
    services.find((s) => s.slug === dripSlug) ??
    services.find((s) => s.id === `seed-${index + 1}`) ??
    services.find((s) => s.name === LIQUIVIDA_DRIPS[index]?.name)
  );
}

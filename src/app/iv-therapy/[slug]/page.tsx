import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import DripDetailContent from "@/components/services/DripDetailContent";
import { getLiquividaDrip } from "@/lib/invita/liquivida-drips";
import { getDripPriceIqd } from "@/lib/invita/pricing";
import { formatIqd } from "@/lib/format";
import { dripProcedureJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { LIQUIVIDA_DRIPS } = await import("@/lib/invita/liquivida-drips");
  return LIQUIVIDA_DRIPS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const drip = getLiquividaDrip(slug);
  if (!drip) return { title: "IV Drip" };
  const price = getDripPriceIqd(slug);
  return {
    title: drip.name,
    description: `${drip.description} From ${formatIqd(price)}.`,
  };
}

export default async function DripDetailPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "nad-plus") {
    redirect("/nad-plus");
  }

  const drip = getLiquividaDrip(slug);
  if (!drip) notFound();

  const priceIqd = getDripPriceIqd(slug);

  return (
    <>
      <JsonLd
        data={dripProcedureJsonLd({
          name: drip.name,
          description: drip.description,
          slug: drip.slug,
          priceIqd,
        })}
      />
      <Navbar />
      <main id="main-content" className="page-main">
        <DripDetailContent drip={drip} priceIqd={priceIqd} />
      </main>
      <Footer />
    </>
  );
}

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JustDripHome from "@/components/just-drip/JustDripHome";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Navbar />
      <main id="main-content">
        <JustDripHome />
      </main>
      <Footer />
    </>
  );
}

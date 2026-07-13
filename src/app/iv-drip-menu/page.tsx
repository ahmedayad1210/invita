import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JustDripHome from "@/components/just-drip/JustDripHome";

export const metadata = {
  title: "JUST DRIP — قائمة المغذيات الوريدية",
  description:
    "فيتامينات وريدية من إنفيتا — 13 بروتوكول، تبدأ من 150,000 دينار. حصرياً للعيادات والمراكز المرخصة في بغداد.",
};

export default function IvDripMenuPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <JustDripHome showHero={false} />
      </main>
      <Footer />
    </>
  );
}

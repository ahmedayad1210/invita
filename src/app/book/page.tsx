"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingProgress from "@/components/booking/BookingProgress";
import StepService from "@/components/booking/StepService";
import StepStylist from "@/components/booking/StepStylist";
import StepDateTime from "@/components/booking/StepDateTime";
import StepConfirm from "@/components/booking/StepConfirm";
import StepIntake from "@/components/booking/StepIntake";
import StepAddOns from "@/components/booking/StepAddOns";
import { useBookingStore } from "@/store/bookingStore";
import { LIQUIVIDA_DRIPS } from "@/lib/invita/liquivida-drips";
import { useLocale } from "@/contexts/LocaleContext";
import type { Service } from "@/lib/supabase/types";

export default function BookPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const { currentStep, setService, setCategory, resetBooking } = useBookingStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    const serviceId = searchParams.get("service");
    const dripSlug = searchParams.get("drip");

    const loadServiceById = async (id: string) => {
      const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setService(json.data as Service);
      }
    };

    const loadServiceByDrip = async (slug: string) => {
      const res = await fetch(`/api/services?slug=${encodeURIComponent(slug)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCategory("iv-therapy");
        setService(json.data as Service);
      }
    };

    if (serviceId) {
      void loadServiceById(serviceId);
      return;
    }

    if (dripSlug) {
      void loadServiceByDrip(dripSlug);
    }
  }, [searchParams, setService]);

  useEffect(() => {
    return () => {
      if (!useBookingStore.getState().confirmedBookingId) {
        resetBooking();
      }
    };
  }, [resetBooking]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="book-page-main">
        <div className="container-invita">
          <header className="book-consultation-header">
            <span className="eyebrow">{t.book.eyebrow}</span>
            <h1 className="book-page-title">{t.book.title}</h1>
            <p className="page-lead">{t.book.subtitle}</p>
            <div className="book-trust-strip" aria-label="Trust indicators">
              {t.book.trustNote.split(" · ").map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </header>

          <BookingProgress />

          <div className="book-consultation-card">
            {currentStep === 1 && <StepService />}
            {currentStep === 2 && <StepStylist />}
            {currentStep === 3 && <StepDateTime />}
            {currentStep === 4 && <StepIntake />}
            {currentStep === 5 && <StepAddOns />}
            {currentStep === 6 && <StepConfirm />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

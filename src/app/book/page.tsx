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
import { useBookingStore } from "@/store/bookingStore";
import { LIQUIVIDA_DRIPS } from "@/lib/invita/liquivida-drips";
import { useLocale } from "@/contexts/LocaleContext";
import type { Service } from "@/lib/supabase/types";

export default function BookPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const { currentStep, setService, resetBooking } = useBookingStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    const serviceId = searchParams.get("service");
    const dripSlug = searchParams.get("drip");

    const loadService = async (id: string) => {
      const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setService(json.data as Service);
      }
    };

    if (serviceId) {
      void loadService(serviceId);
      return;
    }

    if (dripSlug) {
      const index = LIQUIVIDA_DRIPS.findIndex((d) => d.slug === dripSlug);
      if (index >= 0) {
        void loadService(`seed-${index + 1}`);
      }
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
            {currentStep === 5 && <StepConfirm />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

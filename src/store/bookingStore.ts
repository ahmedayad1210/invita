// src/store/bookingStore.ts
// Zustand store for the multi-step booking flow
// Persists step state across component re-renders
// Cleared after successful booking confirmation

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Service, Stylist } from "@/lib/supabase/types";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export interface ClinicalIntakeData {
  goals: string;
  allergies: string;
  medications: string;
  conditions: string;
  pregnant: boolean;
}

export interface BookingState {
  currentStep: BookingStep;
  selectedService: Service | null;
  selectedStylist: Stylist | null;
  selectedDate: string;
  selectedTimeSlot: string;
  notes: string;
  intake: ClinicalIntakeData;
  isSubmitting: boolean;
  submitError: string | null;
  confirmedBookingId: string | null;
  activeCategory: string;
}

export interface BookingActions {
  // Navigation
  setStep:     (step: BookingStep) => void;
  nextStep:    () => void;
  prevStep:    () => void;

  // Step 1
  setService:  (service: Service | null) => void;
  setCategory: (category: string) => void;

  // Step 2
  setStylist:  (stylist: Stylist | null) => void;

  // Step 3
  setDate:     (date: string) => void;
  setTimeSlot: (slot: string) => void;

  // Step 4
  setNotes:    (notes: string) => void;
  setIntake:   (intake: Partial<ClinicalIntakeData>) => void;

  // Submission
  setSubmitting:        (loading: boolean) => void;
  setSubmitError:       (error: string | null) => void;
  setConfirmedBookingId:(id: string | null) => void;

  // Reset
  resetBooking: () => void;
}

export type BookingStore = BookingState & BookingActions;

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────

const initialState: BookingState = {
  currentStep:         1,
  selectedService:     null,
  selectedStylist:     null,
  selectedDate:        "",
  selectedTimeSlot:    "",
  notes:               "",
  intake: {
    goals: "",
    allergies: "",
    medications: "",
    conditions: "",
    pregnant: false,
  },
  isSubmitting:        false,
  submitError:         null,
  confirmedBookingId:  null,
  activeCategory:      "all",
};

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
  ...initialState,

  // ── Navigation ──

  setStep: (step) => {
    set({ currentStep: step });
  },

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 5) {
      set({ currentStep: (currentStep + 1) as BookingStep });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as BookingStep });
    }
  },

  // ── Step 1: Service ──

  setService: (service) => {
    set({
      selectedService:  service,
      // Clear downstream selections when service changes
      selectedStylist:  null,
      selectedDate:     "",
      selectedTimeSlot: "",
      submitError:      null,
    });
  },

  setCategory: (category) => {
    set({ activeCategory: category });
  },

  // ── Step 2: Stylist ──

  setStylist: (stylist) => {
    set({
      selectedStylist:  stylist,
      // Clear downstream selections when stylist changes
      selectedDate:     "",
      selectedTimeSlot: "",
      submitError:      null,
    });
  },

  // ── Step 3: Date & Time ──

  setDate: (date) => {
    set({
      selectedDate:     date,
      // Clear time slot when date changes
      selectedTimeSlot: "",
      submitError:      null,
    });
  },

  setTimeSlot: (slot) => {
    set({
      selectedTimeSlot: slot,
      submitError:      null,
    });
  },

  // ── Step 4: Notes ──

  setNotes: (notes) => {
    set({ notes });
  },

  setIntake: (partial) => {
    set((state) => ({ intake: { ...state.intake, ...partial } }));
  },

  // ── Submission states ──

  setSubmitting: (loading) => {
    set({ isSubmitting: loading });
  },

  setSubmitError: (error) => {
    set({ submitError: error });
  },

  setConfirmedBookingId: (id) => {
    set({ confirmedBookingId: id });
  },

  // ── Reset ──
  // Called after successful booking or when
  // user navigates away from the booking flow

  resetBooking: () => {
    set({ ...initialState });
  },
}),
    {
      name: "invita-booking",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep:      state.currentStep,
        selectedService:  state.selectedService,
        selectedStylist:  state.selectedStylist,
        selectedDate:     state.selectedDate,
        selectedTimeSlot: state.selectedTimeSlot,
        notes:            state.notes,
        intake:           state.intake,
        activeCategory:   state.activeCategory,
      }),
    }
  )
);

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────

export function useStepValidity() {
  const step1Valid = useBookingStore((state) => state.selectedService !== null);
  const step2Valid = useBookingStore((state) => state.selectedStylist !== null);
  const step3Valid = useBookingStore((state) => state.selectedDate !== "" && state.selectedTimeSlot !== "");
  const step4Valid = useBookingStore((state) => state.intake.goals.trim().length > 0);
  const step5Valid = true;
  return { step1Valid, step2Valid, step3Valid, step4Valid, step5Valid };
}

export function useBookingSummary() {
  const service   = useBookingStore((state) => state.selectedService);
  const stylist   = useBookingStore((state) => state.selectedStylist);
  const date      = useBookingStore((state) => state.selectedDate);
  const timeSlot  = useBookingStore((state) => state.selectedTimeSlot);
  const notes     = useBookingStore((state) => state.notes);
  const bookingId = useBookingStore((state) => state.confirmedBookingId);
  return { service, stylist, date, timeSlot, notes, bookingId };
}

export function useBookingNavigation() {
  const currentStep = useBookingStore((state) => state.currentStep);
  const nextStep    = useBookingStore((state) => state.nextStep);
  const prevStep    = useBookingStore((state) => state.prevStep);
  const setStep     = useBookingStore((state) => state.setStep);
  return { currentStep, nextStep, prevStep, setStep };
}
import type { Booking, ClinicalIntake } from "@/lib/supabase/types";

export function intakeFromBooking(booking: Booking): ClinicalIntake | null {
  if (booking.intake_goals?.trim()) {
    return {
      goals: booking.intake_goals,
      allergies: booking.intake_allergies ?? "",
      medications: booking.intake_medications ?? "",
      conditions: booking.intake_conditions ?? "",
      pregnant: booking.intake_pregnant ?? false,
    };
  }

  if (!booking.notes?.includes("[CLINICAL INTAKE]")) return null;

  const match = booking.notes.match(/\[CLINICAL INTAKE\]\n([\s\S]*?)(?:\n\n\[NOTES\]|$)/);
  if (!match?.[1]) return null;

  try {
    const parsed = JSON.parse(match[1]) as ClinicalIntake;
    if (typeof parsed.goals === "string") return parsed;
  } catch {
    return null;
  }

  return null;
}

export function formatIntakeSummary(intake: ClinicalIntake): string {
  const lines = [
    `Goals: ${intake.goals}`,
    `Allergies: ${intake.allergies || "None reported"}`,
    `Medications: ${intake.medications || "None reported"}`,
    `Conditions: ${intake.conditions || "None reported"}`,
    `Pregnant: ${intake.pregnant ? "Yes" : "No"}`,
  ];
  return lines.join("\n");
}

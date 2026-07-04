import Image from "next/image";
import { clinicInitials, type HealthcareClinic } from "@/lib/invita/healthcare-network";

type Props = {
  clinic: HealthcareClinic;
  size?: number;
  className?: string;
};

export default function ClinicLogo({ clinic, size = 56, className = "" }: Props) {
  const initials = clinicInitials(clinic.name);

  return (
    <div
      className={`clinic-logo ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden={clinic.logo.includes("placeholder")}
    >
      {clinic.logo.includes("placeholder") ? (
        <span className="clinic-logo-initials">{initials}</span>
      ) : (
        <Image
          src={clinic.logo}
          alt=""
          width={size}
          height={size}
          className="clinic-logo-image"
        />
      )}
    </div>
  );
}

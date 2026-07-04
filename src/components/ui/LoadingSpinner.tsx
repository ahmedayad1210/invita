// src/components/ui/LoadingSpinner.tsx

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  message?: string;
}

export default function LoadingSpinner({
  size = 40,
  message = "Preparing your experience",
}: LoadingSpinnerProps) {
  return (
    <div className="loading-luxury" role="status" aria-live="polite">
      <div
        className="loading-luxury-ring"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {message ? <p className="loading-luxury-text">{message}</p> : null}
    </div>
  );
}

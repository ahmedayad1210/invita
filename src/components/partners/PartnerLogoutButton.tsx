"use client";

export default function PartnerLogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/partners/logout", { method: "POST" });
    window.location.href = "/partners/login";
  };

  return (
    <button type="button" className="btn-secondary btn-sm" onClick={handleLogout}>
      Sign out
    </button>
  );
}

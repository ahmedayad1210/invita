import bcrypt from "bcryptjs";

export async function verifyPartnerCredentials(
  clinicName: string,
  password: string
): Promise<boolean> {
  const validName = process.env.PARTNER_PORTAL_NAME ?? "Invita Partner";
  const passwordHash = process.env.PARTNER_PASSWORD_HASH;
  const devPassword = process.env.PARTNER_PASSWORD ?? process.env.ADMIN_PASSWORD;

  if (!clinicName.trim()) return false;

  const nameMatch = clinicName.trim().toLowerCase() === validName.trim().toLowerCase();

  if (passwordHash) {
    const passwordMatch = await bcrypt.compare(password, passwordHash);
    if (nameMatch && passwordMatch) return true;
  }

  if (process.env.NODE_ENV !== "production" && devPassword) {
    return nameMatch && password === devPassword;
  }

  return false;
}

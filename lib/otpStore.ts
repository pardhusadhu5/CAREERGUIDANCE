type OtpEntry = {
  otp: string;
  email: string;
  expiresAt: number;
  attempts: number;
};

const otpCache = new Map<string, OtpEntry>();
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function cleanupExpired() {
  const now = Date.now();
  const entries = Array.from(otpCache.entries());
  for (const [email, entry] of entries) {
    if (entry.expiresAt <= now) {
      otpCache.delete(email);
    }
  }
}

export function generateOtpForEmail(email: string) {
  cleanupExpired();
  const normalizedEmail = email.toLowerCase().trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpCache.set(normalizedEmail, {
    email: normalizedEmail,
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
  return otp;
}

export function verifyOtpForEmail(email: string, otp: string) {
  cleanupExpired();
  const normalizedEmail = email.toLowerCase().trim();
  const entry = otpCache.get(normalizedEmail);
  if (!entry) {
    return { success: false, message: 'OTP expired or not requested' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    otpCache.delete(normalizedEmail);
    return { success: false, message: 'Too many attempts. Request a new OTP.' };
  }

  if (entry.otp !== otp.trim()) {
    entry.attempts += 1;
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }

  otpCache.delete(normalizedEmail);
  return { success: true, message: 'Email verified successfully.' };
}

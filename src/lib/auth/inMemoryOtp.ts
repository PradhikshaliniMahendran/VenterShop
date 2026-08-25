// Global in-memory fallback cache for OTP verification across serverless instances
interface OTPRecord {
  code: string;
  expiresAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var globalOtpCache: Map<string, OTPRecord> | undefined;
}

const otpCache = global.globalOtpCache || new Map<string, OTPRecord>();
if (!global.globalOtpCache) {
  global.globalOtpCache = otpCache;
}

export function saveInMemoryOtp(email: string, code: string, durationMs: number = 5 * 60 * 1000) {
  otpCache.set(email.toLowerCase().trim(), {
    code,
    expiresAt: Date.now() + durationMs,
  });
}

export function verifyInMemoryOtp(email: string, code: string): boolean {
  const record = otpCache.get(email.toLowerCase().trim());
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpCache.delete(email.toLowerCase().trim());
    return false;
  }
  return record.code === code.trim();
}

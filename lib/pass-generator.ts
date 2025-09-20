import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_PASS_SECRET || 'default-secret-key';

export function generatePassSignature(studentId: string): string {
  const data = `${studentId}:${Date.now()}`;
  return CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
}

export function verifyPassSignature(studentId: string, signature: string): boolean {
  try {
    // In a real app, you'd store the timestamp and validate it
    const expectedSig = CryptoJS.HmacSHA256(studentId, SECRET_KEY).toString();
    return signature === expectedSig;
  } catch {
    return false;
  }
}

export function generateVerificationUrl(studentId: string): string {
  const signature = generatePassSignature(studentId);
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${baseUrl}/functions/v1/verify?id=${studentId}&sig=${signature}`;
}
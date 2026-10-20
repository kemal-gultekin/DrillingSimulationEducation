/**
 * Security and Cryptographic Utilities for PetroSim
 * 
 * ARCHITECTURAL & SECURITY NOTICE (SPRING BOOT MIGRATION):
 * This client-side SHA-256 password hashing with unique per-user salt is designed
 * for the localStorage prototype phase to ensure passwords are not stored in plaintext.
 * 
 * When migrating to a production Spring Boot REST API:
 * 1. Passwords will be transmitted over secure TLS (HTTPS).
 * 2. Hashing MUST be performed on the backend using Spring Security's BCryptPasswordEncoder
 *    or Argon2 with appropriate cost factor.
 * 3. Session tokens (JWT / HTTP-only Secure Cookies) will replace localStorage persistence.
 */

export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback simple 32-bit hash string if subtle is unavailable in obscure test runners
  let hash = 0;
  const str = `${salt}:${password}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `fallback_${Math.abs(hash).toString(16)}`;
}

export function generateSalt(length = 16): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2, 18);
}

export function generateClassCode(): string {
  // Generates 6-character clean alphanumeric uppercase code (e.g. "PET492", "DRL715")
  const prefixes = ['PET', 'DRL', 'RIG', 'OIL', 'GAS', 'WELL'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}${num}`;
}

export function generateTempPassword(): string {
  // Generates user-friendly temporary password for students added by instructor, e.g. "Petro2026!7"
  const digits = Math.floor(10 + Math.random() * 90);
  return `Petro${new Date().getFullYear()}#${digits}`;
}

export function slugifyUsername(fullName: string): string {
  // Converts Turkish/English name to valid username e.g. "Ahmet Yılmaz" -> "ahmet.yilmaz"
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
  };
  let cleaned = fullName.trim().toLowerCase();
  for (const [key, val] of Object.entries(trMap)) {
    cleaned = cleaned.replaceAll(key, val);
  }
  cleaned = cleaned.replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
  return cleaned || `user.${Math.floor(1000 + Math.random() * 9000)}`;
}

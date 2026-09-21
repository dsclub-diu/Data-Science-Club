import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import 'dotenv/config';

// Fallback secret for local development if not provided in env
const SECRET_KEY = process.env.SESSION_SECRET || 'super_secret_fallback_key_for_development_only';
const secret = new TextEncoder().encode(SECRET_KEY);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(adminId: number, email: string): Promise<string> {
  const jwt = await new jose.SignJWT({ 'urn:dsc:admin': true, adminId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  return jwt;
}

export async function verifyAdminSession(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    if (payload['urn:dsc:admin']) {
      return payload;
    }
    return null;
  } catch (error) {
    return null;
  }
}

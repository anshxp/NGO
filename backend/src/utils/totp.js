import crypto from 'crypto';

const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export const generateTotpSecret = () => {
  const bytes = crypto.randomBytes(20);
  let bits = '';
  for (const byte of bytes) bits += byte.toString(2).padStart(8, '0');
  let secret = '';
  for (let i = 0; i < bits.length; i += 5) secret += base32Alphabet[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)];
  return secret;
};

const base32Decode = (input) => {
  const normalized = String(input || '').replace(/=+$/g, '').toUpperCase();
  let bits = '';
  for (const char of normalized) {
    const value = base32Alphabet.indexOf(char);
    if (value < 0) throw new Error('Invalid TOTP secret');
    bits += value.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
};

export const generateTotpCode = (secret, timestamp = Date.now()) => {
  const counter = Math.floor(timestamp / 1000 / 30);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));
  const digest = crypto.createHmac('sha1', base32Decode(secret)).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = ((digest[offset] & 0x7f) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3];
  return String(binary % 1_000_000).padStart(6, '0');
};

export const verifyTotpCode = (secret, code, timestamp = Date.now()) => {
  const normalized = String(code || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(normalized)) return false;
  for (const offset of [-30_000, 0, 30_000]) {
    const expected = generateTotpCode(secret, timestamp + offset);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(normalized))) return true;
  }
  return false;
};

const encryptionKey = () => crypto.createHash('sha256').update(String(process.env.JWT_SECRET || '')).digest();

export const encryptTotpSecret = (secret) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((value) => value.toString('base64url')).join('.');
};

export const decryptTotpSecret = (payload) => {
  const [iv, tag, ciphertext] = String(payload || '').split('.');
  if (!iv || !tag || !ciphertext) throw new Error('Invalid encrypted TOTP secret');
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64url')), decipher.final()]).toString('utf8');
};

export const buildTotpUri = (secret, email, issuer = 'NGO Management System') => {
  const label = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
};

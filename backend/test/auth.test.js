import test from 'node:test';
import assert from 'node:assert/strict';

process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long';
process.env.JWT_ISSUER = 'ngo-api';
process.env.JWT_AUDIENCE = 'ngo-web';

const { generateToken, verifyToken, hashPassword, comparePassword } = await import('../src/utils/auth.js');

test('JWT round trip preserves user id and token version', () => {
  const token = generateToken('507f1f77bcf86cd799439011', 3);
  const decoded = verifyToken(token);
  assert.deepEqual(decoded, { userId: '507f1f77bcf86cd799439011', tokenVersion: 3 });
});

test('JWT rejects tampered tokens', () => {
  const token = generateToken('507f1f77bcf86cd799439011', 0);
  assert.throws(() => verifyToken(`${token}tampered`), /Invalid or expired token/);
});

test('password hashing is one-way and comparable', async () => {
  const password = 'production-test-password-123';
  const hash = await hashPassword(password);
  assert.notEqual(hash, password);
  assert.equal(await comparePassword(password, hash), true);
  assert.equal(await comparePassword('wrong-password', hash), false);
});

test('password hashing rejects short passwords', async () => {
  await assert.rejects(() => hashPassword('short'), /at least 12 characters/);
});

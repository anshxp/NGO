import test from 'node:test';
import assert from 'node:assert/strict';

process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long';
process.env.JWT_ISSUER = 'ngo-api';
process.env.JWT_AUDIENCE = 'ngo-web';

const { generateTotpSecret, generateTotpCode, verifyTotpCode, encryptTotpSecret, decryptTotpSecret, buildTotpUri } = await import('../src/utils/totp.js');

test('TOTP round trip validates current code', () => {
  const secret = generateTotpSecret();
  const code = generateTotpCode(secret, 1_750_000_000_000);
  assert.equal(verifyTotpCode(secret, code, 1_750_000_000_000), true);
  assert.equal(verifyTotpCode(secret, '000000', 1_750_000_000_000), code === '000000');
});

test('encrypted TOTP secret can be recovered', () => {
  const secret = generateTotpSecret();
  assert.equal(decryptTotpSecret(encryptTotpSecret(secret)), secret);
});

test('TOTP URI is compatible with authenticator applications', () => {
  const secret = generateTotpSecret();
  const uri = buildTotpUri(secret, 'admin@example.org');
  assert.match(uri, /^otpauth:\/\/totp\//);
  assert.match(uri, /secret=/);
  assert.match(uri, /issuer=/);
});

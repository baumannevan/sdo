// jwtUtils.js
// Utility for encoding and decoding JWT tokens for tests
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'test_secret'; // Use env or fallback for tests

export function encode(payload, options = {}) {
  // Encodes a payload into a JWT token
  return jwt.sign(payload, SECRET, { expiresIn: '1h', ...options });
}

export function decode(token) {
  // Decodes a JWT token
  return jwt.verify(token, SECRET);
}

// Export as default for convenience
export default { encode, decode };

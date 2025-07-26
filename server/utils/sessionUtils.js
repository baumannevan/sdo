// sessionUtils.js
// Utility for generating a mock user session object for tests
import crypto from 'crypto';

export async function generateUserSession(user) {
  // Generates a mock session object for a user
  // In a real app, this would interact with your session store
  return {
    csrfToken: crypto.randomBytes(16).toString('hex'), // Random CSRF token
    userId: user.id,
    email: user.email,
    role: user.role,
    createdAt: new Date().toISOString()
  };
}

export default { generateUserSession };

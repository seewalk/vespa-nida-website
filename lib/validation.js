// lib/validation.js

// Rate limiting storage (in-memory for simplicity)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // 3 requests per minute

// Sanitization functions
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[^\w\s\-.,!?@()]/g, '') // Keep only safe characters
    .substring(0, 500); // Limit length
};

export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleaned = email.trim().toLowerCase();
  
  return emailRegex.test(cleaned) ? cleaned : '';
};

export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return '';
  
  // Remove all non-digits and common phone separators
  const cleaned = phone.replace(/[^\d+\-\s()]/g, '').trim();
  
  return cleaned.length >= 8 && cleaned.length <= 20 ? cleaned : '';
};

// Validation functions
export const validateBookingData = (data) => {
  const errors = [];
  
  // Required fields validation
  if (!data.name || data.name.length < 2) {
    errors.push('Vardas ir pavardė privalomi (min 2 simboliai)');
  }
  
  if (!data.email || !data.email.includes('@')) {
    errors.push('Neteisingas el. pašto adresas');
  }
  
  if (!data.phone || data.phone.length < 8) {
    errors.push('Neteisingas telefono numeris');
  }
  
  if (!data.startDate) {
    errors.push('Nuomos data privaloma');
  }
  
  if (!data.age || data.age < 21 || data.age > 80) {
    errors.push('Amžius turi būti nuo 21 iki 80 metų');
  }
  
  if (!data.drivingLicense) {
    errors.push('Vairuotojo pažymėjimo kategorija privaloma');
  }
  
  // Date validation
  if (data.startDate) {
    const selectedDate = new Date(data.startDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (selectedDate < tomorrow) {
      errors.push('Nuomos data turi būti ne anksčiau nei rytoj');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Rate limiting
export const checkRateLimit = (clientId) => {
  const now = Date.now();
  const clientKey = `rate_limit_${clientId}`;
  
  if (!rateLimitStore.has(clientKey)) {
    rateLimitStore.set(clientKey, []);
  }
  
  const requests = rateLimitStore.get(clientKey);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => 
    now - timestamp < RATE_LIMIT_WINDOW
  );
  
  if (validRequests.length >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: RATE_LIMIT_WINDOW - (now - validRequests[0])
    };
  }
  
  // Add current request
  validRequests.push(now);
  rateLimitStore.set(clientKey, validRequests);
  
  return {
    allowed: true,
    remaining: MAX_REQUESTS - validRequests.length
  };
};

// Security helpers
export const generateSecureReference = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `VN${new Date().getFullYear()}-${timestamp.toString().slice(-6)}${randomString.toUpperCase()}`;
};

export const validateCSRF = (token) => {
  // Simple CSRF validation - in production, use proper CSRF tokens
  return typeof token === 'string' && token.length > 10;
};
/**
 * Comprehensive Input Validation and Sanitization Utilities
 * Prevents XSS, injection attacks, and data corruption
 */

import DOMPurify from 'dompurify';

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9\s\-_]+$/,
  name: /^[a-zA-Z\s\-'.]+$/,
  company: /^[a-zA-Z0-9\s\-'.&,()]+$/,
  jobTitle: /^[a-zA-Z0-9\s\-'.&,()/]+$/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?$/,
  twitter: /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/,
  github: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9\-_]+\/?$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  color: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  datetime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
  currency: /^\d+(\.\d{2})?$/,
  percentage: /^(100|[1-9]?\d)(\.\d+)?%?$/,
  html: /<[^>]*>/g,
  script: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  sql: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
  xss: /<script|javascript:|on\w+\s*=|data:text\/html|vbscript:|<iframe|<object|<embed|<link|<meta/gi,
};

// Input length limits
export const INPUT_LIMITS = {
  email: { min: 5, max: 254 },
  name: { min: 1, max: 100 },
  company: { min: 1, max: 200 },
  jobTitle: { min: 1, max: 150 },
  description: { min: 0, max: 5000 },
  message: { min: 1, max: 2000 },
  url: { min: 10, max: 2048 },
  phone: { min: 10, max: 20 },
  address: { min: 5, max: 500 },
  notes: { min: 0, max: 10000 },
  password: { min: 8, max: 128 },
  username: { min: 3, max: 50 },
  slug: { min: 1, max: 100 },
  tag: { min: 1, max: 50 },
  search: { min: 1, max: 200 },
};

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
  warnings?: string[];
}

// Sanitization options
export interface SanitizationOptions {
  allowHtml?: boolean;
  maxLength?: number;
  trim?: boolean;
  removeScripts?: boolean;
  removeStyles?: boolean;
  normalizeWhitespace?: boolean;
}

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(
  input: string,
  options: SanitizationOptions = {}
): string {
  if (!input || typeof input !== 'string') return '';

  const {
    allowHtml = false,
    removeScripts = true,
    removeStyles = true,
    normalizeWhitespace = true,
  } = options;

  let sanitized = input;

  // Remove scripts and dangerous content
  if (removeScripts) {
    sanitized = sanitized.replace(VALIDATION_PATTERNS.script, '');
    sanitized = sanitized.replace(VALIDATION_PATTERNS.xss, '');
  }

  // Remove styles if not allowed
  if (removeStyles) {
    sanitized = sanitized.replace(
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
      ''
    );
  }

  // Use DOMPurify for comprehensive sanitization
  if (allowHtml) {
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'ol',
        'ul',
        'li',
        'a',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ],
      ALLOWED_ATTR: ['href', 'title', 'target'],
      ALLOW_DATA_ATTR: false,
    });
  } else {
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  // Normalize whitespace
  if (normalizeWhitespace) {
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
  }

  return sanitized;
}

/**
 * Validate and sanitize text input
 */
export function validateText(
  input: string,
  fieldName: string,
  options: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    sanitize?: boolean;
  } = {}
): ValidationResult {
  const {
    pattern,
    minLength = 0,
    maxLength = 1000,
    required = false,
    sanitize = true,
  } = options;

  const errors: string[] = [];
  let sanitizedValue = input;

  // Check if required
  if (required && (!input || input.trim().length === 0)) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  // Skip validation if input is empty and not required
  if (!input || input.trim().length === 0) {
    return { isValid: true, errors: [], sanitizedValue: '' };
  }

  // Sanitize input
  if (sanitize) {
    sanitizedValue = sanitizeHtml(input, { allowHtml: false });
  }

  // Check length
  if (sanitizedValue.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters long`);
  }

  if (sanitizedValue.length > maxLength) {
    errors.push(
      `${fieldName} must be no more than ${maxLength} characters long`
    );
  }

  // Check pattern
  if (pattern && !pattern.test(sanitizedValue)) {
    errors.push(`${fieldName} format is invalid`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue,
  };
}

/**
 * Validate email address
 */
export function validateEmail(
  email: string,
  required: boolean = true
): ValidationResult {
  return validateText(email, 'Email', {
    pattern: VALIDATION_PATTERNS.email,
    minLength: INPUT_LIMITS.email.min,
    maxLength: INPUT_LIMITS.email.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate phone number
 */
export function validatePhone(
  phone: string,
  required: boolean = false
): ValidationResult {
  // Remove all non-digit characters except + at the beginning
  const cleaned = phone.replace(/[^\d+]/g, '');

  return validateText(cleaned, 'Phone', {
    pattern: VALIDATION_PATTERNS.phone,
    minLength: INPUT_LIMITS.phone.min,
    maxLength: INPUT_LIMITS.phone.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate URL
 */
export function validateUrl(
  url: string,
  required: boolean = false
): ValidationResult {
  return validateText(url, 'URL', {
    pattern: VALIDATION_PATTERNS.url,
    minLength: INPUT_LIMITS.url.min,
    maxLength: INPUT_LIMITS.url.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate LinkedIn profile URL
 */
export function validateLinkedIn(
  url: string,
  required: boolean = false
): ValidationResult {
  return validateText(url, 'LinkedIn URL', {
    pattern: VALIDATION_PATTERNS.linkedin,
    minLength: INPUT_LIMITS.url.min,
    maxLength: INPUT_LIMITS.url.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate company name
 */
export function validateCompanyName(
  name: string,
  required: boolean = true
): ValidationResult {
  return validateText(name, 'Company Name', {
    pattern: VALIDATION_PATTERNS.company,
    minLength: INPUT_LIMITS.company.min,
    maxLength: INPUT_LIMITS.company.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate job title
 */
export function validateJobTitle(
  title: string,
  required: boolean = true
): ValidationResult {
  return validateText(title, 'Job Title', {
    pattern: VALIDATION_PATTERNS.jobTitle,
    minLength: INPUT_LIMITS.jobTitle.min,
    maxLength: INPUT_LIMITS.jobTitle.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate person name
 */
export function validatePersonName(
  name: string,
  required: boolean = true
): ValidationResult {
  return validateText(name, 'Name', {
    pattern: VALIDATION_PATTERNS.name,
    minLength: INPUT_LIMITS.name.min,
    maxLength: INPUT_LIMITS.name.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate search query
 */
export function validateSearchQuery(
  query: string,
  required: boolean = true
): ValidationResult {
  return validateText(query, 'Search Query', {
    minLength: INPUT_LIMITS.search.min,
    maxLength: INPUT_LIMITS.search.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate message content
 */
export function validateMessage(
  message: string,
  required: boolean = true
): ValidationResult {
  return validateText(message, 'Message', {
    minLength: INPUT_LIMITS.message.min,
    maxLength: INPUT_LIMITS.message.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate notes content
 */
export function validateNotes(
  notes: string,
  required: boolean = false
): ValidationResult {
  return validateText(notes, 'Notes', {
    minLength: INPUT_LIMITS.notes.min,
    maxLength: INPUT_LIMITS.notes.max,
    required,
    sanitize: true,
  });
}

/**
 * Validate UUID
 */
export function validateUuid(
  uuid: string,
  required: boolean = true
): ValidationResult {
  return validateText(uuid, 'ID', {
    pattern: VALIDATION_PATTERNS.uuid,
    required,
    sanitize: false,
  });
}

/**
 * Validate form data object
 */
export function validateFormData<T extends Record<string, unknown>>(
  data: T,
  validationRules: Record<keyof T, (value: unknown) => ValidationResult>
): {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData: Partial<T>;
} {
  const errors: Record<string, string[]> = {};
  const sanitizedData: Partial<T> = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(validationRules)) {
    const result = validator(data[field]);

    if (!result.isValid) {
      errors[field] = result.errors;
      isValid = false;
    }

    if (result.sanitizedValue !== undefined) {
      sanitizedData[field as keyof T] = result.sanitizedValue as T[keyof T];
    }
  }

  return { isValid, errors, sanitizedData };
}

/**
 * Check for potential SQL injection
 */
export function detectSqlInjection(input: string): boolean {
  return VALIDATION_PATTERNS.sql.test(input);
}

/**
 * Check for potential XSS attacks
 */
export function detectXss(input: string): boolean {
  return VALIDATION_PATTERNS.xss.test(input);
}

/**
 * Rate limiting for input validation
 */
class InputRateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number }>();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    // Increment count
    attempt.count++;
    attempt.lastAttempt = now;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const inputRateLimiter = new InputRateLimiter();

/**
 * Comprehensive input validation hook
 */
export function useInputValidation() {
  return {
    validateEmail,
    validatePhone,
    validateUrl,
    validateLinkedIn,
    validateCompanyName,
    validateJobTitle,
    validatePersonName,
    validateSearchQuery,
    validateMessage,
    validateNotes,
    validateUuid,
    validateFormData,
    sanitizeHtml,
    detectSqlInjection,
    detectXss,
    inputRateLimiter,
  };
}

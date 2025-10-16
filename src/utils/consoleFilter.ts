/**
 * Console Filter Utility
 * Suppresses noise from browser extensions and development tools
 */

// Store original console methods
const originalConsole = {
  warn: console.warn,
  error: console.error,
  log: console.log,
  info: console.info,
};

// Patterns to suppress
const suppressedPatterns = [
  // SES (Secure EcmaScript) warnings
  /SES Removing unpermitted intrinsics/,
  /Removing intrinsics\.%DatePrototype%\.toTemporalInstant/,
  /lockdown-install\.js/,
  /SES_UNCAUGHT_EXCEPTION/,

  // Source map errors
  /Source map error/,
  /installHook\.js\.map/,
  /JSON\.parse: unexpected character/,

  // Browser extension noise
  /Extension context invalidated/,
  /chrome-extension:/,
  /moz-extension:/,
  /safari-extension:/,

  // Development tool noise
  /DevTools/,
  /React DevTools/,
  /Redux DevTools/,
];

// Check if message should be suppressed
function shouldSuppress(message: string): boolean {
  return suppressedPatterns.some(pattern => pattern.test(message));
}

// Filter console methods
function filterConsoleMethod(originalMethod: typeof console.warn) {
  return function (...args: any[]) {
    const message = args.join(' ');
    if (shouldSuppress(message)) {
      return; // Suppress the message
    }
    originalMethod.apply(console, args);
  };
}

// Initialize console filtering
export function initializeConsoleFilter(): void {
  // Only apply in development to avoid hiding important production errors
  if (import.meta.env.DEV) {
    console.warn = filterConsoleMethod(originalConsole.warn);
    console.error = filterConsoleMethod(originalConsole.error);
    console.log = filterConsoleMethod(originalConsole.log);
    console.info = filterConsoleMethod(originalConsole.info);
  }
}

// Restore original console methods
export function restoreConsole(): void {
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.log = originalConsole.log;
  console.info = originalConsole.info;
}

// Add custom suppression patterns
export function addSuppressionPattern(pattern: RegExp): void {
  suppressedPatterns.push(pattern);
}

// Remove suppression patterns
export function removeSuppressionPattern(pattern: RegExp): void {
  const index = suppressedPatterns.indexOf(pattern);
  if (index > -1) {
    suppressedPatterns.splice(index, 1);
  }
}

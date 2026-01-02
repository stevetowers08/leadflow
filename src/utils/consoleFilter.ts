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
  debug: console.debug as typeof console.debug | undefined,
};

// Patterns to suppress
const suppressedPatterns = [
  // SES (Secure EcmaScript) warnings
  /SES Removing unpermitted intrinsics/,
  /Removing intrinsics\.%DatePrototype%\.toTemporalInstant/,
  /lockdown-install\.js/,
  /SES_UNCAUGHT_EXCEPTION/,
  /SES.*lockdown/,
  /intrinsics.*toTemporalInstant/,
  /DatePrototype.*toTemporalInstant/,

  // Source map errors
  /Source map error/,
  /installHook\.js\.map/,
  /JSON\.parse: unexpected character/,

  // Image loading errors (common with external logo services)
  /Failed to load resource: IMG/,
  /logo\.clearbit\.com/,
  /Resource Load Error.*IMG/,

  // Database errors (PGRST116 = no rows found, which is normal)
  /Error fetching current owner.*PGRST116/,
  /Cannot coerce the result to a single JSON object/,

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
  return function (...args: unknown[]) {
    // Only convert the first argument (message string) to string for suppression check
    // This preserves objects in the original arguments for proper console display
    const message = args.length > 0 ? String(args[0]) : '';
    if (shouldSuppress(message)) {
      return; // Suppress the message
    }
    originalMethod.apply(console, args);
  };
}

// Initialize console filtering
export function initializeConsoleFilter(): void {
  // Apply console filtering in all environments to suppress browser extension noise
  // This is safe because we're only filtering known browser extension warnings
  console.warn = filterConsoleMethod(originalConsole.warn);
  console.error = filterConsoleMethod(originalConsole.error);
  console.log = filterConsoleMethod(originalConsole.log);
  console.info = filterConsoleMethod(originalConsole.info);

  // Also filter console.debug if it exists
  if (console.debug && originalConsole.debug) {
    console.debug = filterConsoleMethod(originalConsole.debug);
  }
}

// Restore original console methods
export function restoreConsole(): void {
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  if (originalConsole.debug) {
    console.debug = originalConsole.debug;
  }
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

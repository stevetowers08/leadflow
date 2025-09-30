import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
})

// Console inspection utilities for testing
export const consoleUtils = {
  // Capture console logs during tests
  captureConsole: () => {
    const logs: Array<{ type: string; message: string; timestamp: number }> = []
    
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    }
    
    // Override console methods
    console.log = (...args) => {
      logs.push({ type: 'log', message: args.join(' '), timestamp: Date.now() })
      originalConsole.log(...args)
    }
    
    console.error = (...args) => {
      logs.push({ type: 'error', message: args.join(' '), timestamp: Date.now() })
      originalConsole.error(...args)
    }
    
    console.warn = (...args) => {
      logs.push({ type: 'warn', message: args.join(' '), timestamp: Date.now() })
      originalConsole.warn(...args)
    }
    
    console.info = (...args) => {
      logs.push({ type: 'info', message: args.join(' '), timestamp: Date.now() })
      originalConsole.info(...args)
    }
    
    return {
      logs,
      restore: () => {
        console.log = originalConsole.log
        console.error = originalConsole.error
        console.warn = originalConsole.warn
        console.info = originalConsole.info
      },
      getErrors: () => logs.filter(log => log.type === 'error'),
      getWarnings: () => logs.filter(log => log.type === 'warn'),
      getAll: () => logs,
    }
  },
  
  // Debug helper for tests
  debugTest: (testName: string, data: any) => {
    console.log(`[TEST DEBUG] ${testName}:`, data)
  }
}




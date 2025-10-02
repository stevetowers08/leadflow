// Simple toast replacement to avoid React temporal dead zone issues with Sonner
export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // You can replace this with a simple notification or alert
    if (typeof window !== 'undefined') {
      // Simple browser notification
      try {
        new Notification('Success', { body: message });
      } catch {
        // Fallback to console if notifications not supported
        console.log('Success:', message);
      }
    }
  },
  
  error: (message: string) => {
    console.error('❌ Error:', message);
    if (typeof window !== 'undefined') {
      try {
        new Notification('Error', { body: message });
      } catch {
        console.error('Error:', message);
      }
    }
  },
  
  info: (message: string) => {
    console.info('ℹ️ Info:', message);
    if (typeof window !== 'undefined') {
      try {
        new Notification('Info', { body: message });
      } catch {
        console.info('Info:', message);
      }
    }
  },
  
  warning: (message: string) => {
    console.warn('⚠️ Warning:', message);
    if (typeof window !== 'undefined') {
      try {
        new Notification('Warning', { body: message });
      } catch {
        console.warn('Warning:', message);
      }
    }
  }
};

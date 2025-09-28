// Debug environment variables
console.log('🔍 Environment Debug Info:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('All env vars:', import.meta.env);

export const debugEnv = () => {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    allEnv: import.meta.env
  };
};

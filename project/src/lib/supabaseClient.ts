import { createClient } from "@supabase/supabase-js";

// Hardcoded values for testing
const supabaseUrl = "https://tnybszihaxdzvcdvlfkc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueWJzemloYXhkenZjZHZsZmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NDI0NzcsImV4cCI6MjA2NzIxODQ3N30.cm1KcQKA83ZA92s9C0In9J_ZT79sUSRa_FvmfVyiy0Y";

console.log('Using hardcoded Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);

// Default export for compatibility
export default supabase;
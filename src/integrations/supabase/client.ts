
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zcynghsqewxhhzlhiujl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjeW5naHNxZXd4aGh6bGhpdWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxODQ0OTAsImV4cCI6MjA1Mjc2MDQ5MH0.MddfuaseAGP2rCW6l4KAc7cmYONxYHgRPuNytyJaf_4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'supabase-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
  },
});

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mtuplhupdpedhrqdwnom.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dXBsaHVwZHBlZGhycWR3bm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMzM2MTMsImV4cCI6MjA1MTYwOTYxM30.Pdv0rOxwk0YCPjY3kdJpZ2_u0g6YFCP2PwvE1gddqqw";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'barber-session',
    storage: window.localStorage
  }
});
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

globalThis.fetch = fetch; // ← On ajoute fetch à Node

const SUPABASE_URL = 'https://kpdckfosawsbcgcgfbko.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZGNrZm9zYXdzYmNnY2dmYmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjUzNTQsImV4cCI6MjA3ODQwMTM1NH0.4vt_tJczPGvLs5QqXPvS4lsdoiAncaSKGcON-n8wUck';

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data, error } = await client
    .from('nom_de_ta_table') // (remplace ici, toujours)
    .select('*');

  console.log("Données :", data);
  console.log("Erreur :", error);
}

test();

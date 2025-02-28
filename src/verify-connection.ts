import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyConnection() {
  try {
    // Check if we can connect and query the library_clues table
    const { data, error, count } = await supabase
      .from('library_clues')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Error querying library_clues:', error);
      return;
    }

    console.log('Successfully connected to library_clues table');
    console.log('Number of records:', count);
    console.log('Sample data:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    process.exit(0);
  }
}

verifyConnection();

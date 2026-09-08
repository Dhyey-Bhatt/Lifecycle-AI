import { supabase } from './supabase.js';

async function check() {
  console.log('Checking profiles table...');
  const { data: pData, error: pError } = await supabase.from('profiles').select('*').limit(1);
  if (pError) {
    console.error('Error fetching from profiles:', pError);
  } else {
    console.log('Profiles table exists! Rows:', pData);
  }

  console.log('Checking vendor_requests table...');
  const { data: rData, error: rError } = await supabase.from('vendor_requests').select('*').limit(1);
  if (rError) {
    console.error('Error fetching from vendor_requests:', rError);
  } else {
    console.log('Vendor requests table exists! Rows:', rData);
  }
}

check();

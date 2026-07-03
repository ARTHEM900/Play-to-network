const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.trim();
    }
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, anonKey);

async function test() {
  try {
    const row = {
      registration_number: 'TEST-123',
      tournament_id: '1',
      registration_type: 'individual',
      amount: 600,
      payment_status: 'Pending',
      registration_status: 'Pending',
      transaction_id: 'TXN1234567890',
      payment_screenshot_url: 'https://example.com/test.jpg'
    };
    
    const { data, error } = await supabase
      .from('registrations')
      .insert(row)
      .select();
      
    console.log('Result data:', data);
    console.log('Result error:', error);
  } catch (err) {
    console.error('Catch error:', err);
  }
}

test();

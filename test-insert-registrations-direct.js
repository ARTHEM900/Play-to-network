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

async function testInsert() {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .insert({
        tournament_id: '1',
        registration_number: 'PTN-TEST-999',
        registration_type: 'individual',
        payment_status: 'Pending',
        registration_status: 'Pending',
        payment_screenshot_url: 'https://example.com/screenshot.jpg'
      })
      .select();

    console.log('Insert Result:', data);
    console.log('Insert Error:', error);
  } catch (err) {
    console.error('Caught error:', err);
  }
}

testInsert();

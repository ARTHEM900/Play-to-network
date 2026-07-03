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

const candidateFields = [
  'id', 'registration_number', 'tournament_id', 'team_id', 'player_id',
  'registration_type', 'amount', 'payment_status', 'registration_status',
  'transaction_id', 'payment_screenshot_url', 'created_at', 'updated_at',
  'status', 'type', 'name', 'captain_name', 'captain_phone', 'captain_email',
  'phone', 'email', 'city', 'college', 'instagram', 'players', 'substitute',
  'preferred_position', 'game_id', 'payment_method'
];

async function scanTable(tableName) {
  const existingFields = [];
  for (const field of candidateFields) {
    const dummyObj = {};
    dummyObj[field] = 'test_val_dummy';
    if (field === 'amount') dummyObj[field] = 0; // type handling
    
    const { error } = await supabase.from(tableName).insert(dummyObj).select();
    if (error) {
      if (error.code === 'PGRST204' && error.message.includes('Could not find')) {
        // Field does not exist
      } else {
        // Field exists (error is constraint violation or type mismatch)
        existingFields.push(field);
      }
    } else {
      // Succeeded (field exists and no constraints violated)
      existingFields.push(field);
    }
  }
  console.log(`\nTable ${tableName} fields:`, existingFields);
}

async function run() {
  await scanTable('registrations');
  await scanTable('teams');
  await scanTable('players');
}

run();

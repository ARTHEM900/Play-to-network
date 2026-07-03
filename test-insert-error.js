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
    const { error: regError } = await supabase.from('registrations').insert({ non_existent_column: 'test' }).select();
    console.log('Registrations error:', regError);

    const { error: teamError } = await supabase.from('teams').insert({ non_existent_column: 'test' }).select();
    console.log('Teams error:', teamError);

    const { error: playerError } = await supabase.from('players').insert({ non_existent_column: 'test' }).select();
    console.log('Players error:', playerError);
  } catch (err) {
    console.error(err);
  }
}

test();

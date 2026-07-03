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

async function verify() {
  try {
    const { data: regs, error: err1 } = await supabase.from('registrations').select('*');
    const { data: teams, error: err2 } = await supabase.from('teams').select('*');
    const { data: players, error: err3 } = await supabase.from('players').select('*');

    if (err1 || err2 || err3) {
      console.error('Errors:', err1, err2, err3);
      return;
    }

    console.log(`Successfully fetched records:`);
    console.log(`Registrations: ${regs.length}`);
    console.log(`Teams: ${teams.length}`);
    console.log(`Players: ${players.length}`);

    if (regs.length > 0) {
      console.log('Sample Registration:', regs[0]);
    }
  } catch (e) {
    console.error('Caught error:', e);
  }
}

verify();

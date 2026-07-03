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

async function insertData() {
  try {
    console.log('Inserting Team Registration...');
    const { data: team, error: teamErr } = await supabase
      .from('teams')
      .insert({
        team_name: 'Supernovas FC',
        captain_name: 'Sam Smith',
        captain_phone: '+91 9999988888',
        captain_email: 'sam.smith@gmail.com',
        city: 'Delhi NCR',
        college: 'NSUT',
        instagram: '@sam_supernovas'
      })
      .select()
      .single();

    if (teamErr) throw teamErr;
    console.log('Inserted Team:', team.id);

    const playersList = [
      { player_name: 'Sam Smith', team_id: team.id },
      { player_name: 'Lionel Messi', team_id: team.id },
      { player_name: 'Cristiano Ronaldo', team_id: team.id },
      { player_name: 'Neymar Jr', team_id: team.id },
      { player_name: 'Kylian Mbappe', team_id: team.id }
    ];

    const { error: playersErr } = await supabase
      .from('players')
      .insert(playersList);

    if (playersErr) throw playersErr;
    console.log('Inserted Players.');

    const { data: reg, error: regErr } = await supabase
      .from('registrations')
      .insert({
        team_id: team.id,
        tournament_id: '1',
        registration_number: 'PTN-3V3-TEM-889900',
        registration_type: 'team',
        payment_status: 'Pending',
        registration_status: 'Pending',
        payment_screenshot_url: 'https://example.com/receipt1.png'
      })
      .select()
      .single();

    if (regErr) throw regErr;
    console.log('Inserted Registration:', reg.registration_number);

    console.log('\nInserting Individual Registration...');
    const { data: indTeam, error: indTeamErr } = await supabase
      .from('teams')
      .insert({
        team_name: 'John Doe',
        captain_name: 'John Doe',
        captain_phone: '+91 7777766666',
        captain_email: 'john.doe@gmail.com',
        city: 'Noida',
        college: 'Amity University',
        instagram: '@johndoe_football'
      })
      .select()
      .single();

    if (indTeamErr) throw indTeamErr;
    console.log('Inserted Indiv Team:', indTeam.id);

    const { error: indPlayerErr } = await supabase
      .from('players')
      .insert({ player_name: 'John Doe', team_id: indTeam.id });

    if (indPlayerErr) throw indPlayerErr;

    const { data: indReg, error: indRegErr } = await supabase
      .from('registrations')
      .insert({
        team_id: indTeam.id,
        tournament_id: '1',
        registration_number: 'PTN-3V3-IND-112233',
        registration_type: 'individual',
        payment_status: 'Verified',
        registration_status: 'Approved',
        payment_screenshot_url: 'https://example.com/receipt2.png'
      })
      .select()
      .single();

    if (indRegErr) throw indRegErr;
    console.log('Inserted Indiv Registration:', indReg.registration_number);

    console.log('All sample data inserted successfully.');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
}

insertData();

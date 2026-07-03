const fs = require('fs');
const path = require('path');
const http = require('https');

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

if (!url || !anonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const tables = ['players', 'teams', 'registrations'];

tables.forEach(table => {
  const reqUrl = `${url}/rest/v1/${table}?limit=1`;
  const parsedUrl = new URL(reqUrl);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Accept': 'text/csv'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    console.log(`\nTable: ${table} - Status: ${res.statusCode}`);
    console.log(`Table: ${table} - Headers:`, res.headers);
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`Table: ${table} - Body: ${data}`);
    });
  });

  req.on('error', (e) => {
    console.error(`Request error for ${table}:`, e);
  });

  req.end();
});

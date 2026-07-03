import fs from 'fs';
import path from 'path';

const root = process.cwd();

// Helper to create dirs
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Create directory structure
const dirs = [
  'src/app',
  'src/features/auth/components',
  'src/features/auth/actions',
  'src/features/auth/queries',
  'src/features/auth/validations',
  'src/features/tournaments/components',
  'src/features/tournaments/actions',
  'src/features/tournaments/queries',
  'src/features/tournaments/validations',
  'src/features/registrations/components',
  'src/features/registrations/actions',
  'src/features/registrations/queries',
  'src/features/registrations/validations',
  'src/features/teams/components',
  'src/features/teams/actions',
  'src/features/teams/queries',
  'src/features/teams/validations',
  'src/features/players/components',
  'src/features/players/actions',
  'src/features/players/queries',
  'src/features/players/validations',
  'src/features/admin/components',
  'src/features/admin/actions',
  'src/features/admin/queries',
  'src/features/admin/validations',
  'src/shared/components/ui',
  'src/shared/hooks',
  'src/shared/utils',
  'src/shared/constants',
  'src/hooks',
  'src/types',
  'src/lib/prisma',
  'src/lib/repositories',
  'src/lib/supabase',
  'src/lib/database',
  'prisma'
];

dirs.forEach(d => ensureDir(path.join(root, d)));

// 2. Create placeholder files
const placeholders = {
  'src/lib/repositories/registration.repository.ts': '// Placeholder for Registration Repository\nexport class RegistrationRepository {}',
  'src/lib/repositories/team.repository.ts': '// Placeholder for Team Repository\nexport class TeamRepository {}',
  'src/lib/repositories/player.repository.ts': '// Placeholder for Player Repository\nexport class PlayerRepository {}',
  'src/lib/repositories/tournament.repository.ts': '// Placeholder for Tournament Repository\nexport class TournamentRepository {}',
  'prisma/schema.prisma': '// Placeholder for Prisma Schema\n// DO NOT RUN MIGRATIONS YET\n',
  'src/lib/prisma/client.ts': '// Placeholder for Prisma Client\nexport const prisma = {};'
};

for (const [file, content] of Object.entries(placeholders)) {
  fs.writeFileSync(path.join(root, file), content);
}

// 3. Move folders/files mapping
const moveMap = [
  { src: 'app', dest: 'src/app' },
  { src: 'lib/supabase', dest: 'src/lib/supabase' },
  { src: 'lib/utils.ts', dest: 'src/shared/utils/utils.ts' },
  { src: 'components/ui', dest: 'src/shared/components/ui' },
  { src: 'components/tournaments', dest: 'src/features/tournaments/components/tournaments' },
  { src: 'components/events', dest: 'src/features/tournaments/components/events' },
  { src: 'components/matches', dest: 'src/features/tournaments/components/matches' },
  { src: 'components/featured-teams.tsx', dest: 'src/features/teams/components/featured-teams.tsx' },
  { src: 'components/top-players.tsx', dest: 'src/features/players/components/top-players.tsx' }
];

moveMap.forEach(({ src, dest }) => {
  const srcPath = path.join(root, src);
  const destPath = path.join(root, dest);
  if (fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, destPath, { recursive: true });
    try {
      fs.rmSync(srcPath, { recursive: true, force: true });
    } catch (e) {
      console.warn(`Could not delete ${srcPath}, please delete it manually.`);
    }
  }
});

// Any remaining files in components/ go to src/shared/components/
if (fs.existsSync(path.join(root, 'components'))) {
  const remaining = fs.readdirSync(path.join(root, 'components'));
  remaining.forEach(item => {
    const srcPath = path.join(root, 'components', item);
    const destPath = path.join(root, 'src/shared/components', item);
    fs.cpSync(srcPath, destPath, { recursive: true });
  });
  // Safely try to remove empty components directory
  try {
    fs.rmSync(path.join(root, 'components'), { recursive: true, force: true });
  } catch (e) {
    console.warn('Could not delete components dir, please delete manually');
  }
}

// Ensure lib is empty before removing, except we had lib/utils.ts and lib/supabase
if (fs.existsSync(path.join(root, 'lib'))) {
  try {
    fs.rmdirSync(path.join(root, 'lib'));
  } catch (e) {}
}

// 4. Update tsconfig.json
const tsconfigPath = path.join(root, 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  let tsconfig = fs.readFileSync(tsconfigPath, 'utf-8');
  tsconfig = tsconfig.replace(/"@\/\*"\s*:\s*\[\s*"\.\/\*"\s*\]/g, '"@/*": ["./src/*"]');
  fs.writeFileSync(tsconfigPath, tsconfig);
}

// 5. Update imports in all .ts and .tsx files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allCodeFiles = getAllFiles(path.join(root, 'src'));
// Also include middleware.ts at root
if (fs.existsSync(path.join(root, 'middleware.ts'))) {
  allCodeFiles.push(path.join(root, 'middleware.ts'));
}

allCodeFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Replacements
  content = content.replace(/@\/components\/ui/g, '@/shared/components/ui');
  content = content.replace(/@\/components\/tournaments/g, '@/features/tournaments/components/tournaments');
  content = content.replace(/@\/components\/events/g, '@/features/tournaments/components/events');
  content = content.replace(/@\/components\/matches/g, '@/features/tournaments/components/matches');
  content = content.replace(/@\/components\/featured-teams/g, '@/features/teams/components/featured-teams');
  content = content.replace(/@\/components\/top-players/g, '@/features/players/components/top-players');
  content = content.replace(/@\/components\//g, '@/shared/components/');
  
  content = content.replace(/@\/lib\/utils/g, '@/shared/utils/utils');
  // Note: @/lib/supabase remains @/lib/supabase (mapped correctly via tsconfig ./src/*)

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});

console.log('Refactor script completed successfully.');

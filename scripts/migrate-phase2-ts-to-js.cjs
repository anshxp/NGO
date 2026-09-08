const fs = require('fs');
const path = require('path');

// Phase 2 installs TypeScript in the frontend project. Resolve it using
// Node's normal package lookup rooted at frontend so npm layout changes do
// not break the migration script.
let ts;
try {
  const frontendRoot = path.join(process.cwd(), 'frontend');
  const typescriptEntry = require.resolve('typescript', { paths: [frontendRoot] });
  ts = require(typescriptEntry);
} catch (error) {
  console.error('Unable to load the TypeScript compiler from the frontend project.');
  console.error(error.message);
  process.exit(1);
}

const roots = [path.join(process.cwd(), 'backend', 'src'), path.join(process.cwd(), 'frontend', 'src')];
const migrated = [];
const removed = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) out.push(full);
  }
  return out;
}

for (const root of roots) {
  for (const source of walk(root)) {
    const ext = path.extname(source);
    const base = source.slice(0, -ext.length);
    const existing = ext === '.tsx' ? `${base}.jsx` : `${base}.js`;

    if (fs.existsSync(existing)) {
      fs.rmSync(source);
      removed.push(path.relative(process.cwd(), source));
      continue;
    }

    const input = fs.readFileSync(source, 'utf8');
    const result = ts.transpileModule(input, {
      fileName: source,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        jsx: ts.JsxEmit.Preserve,
        esModuleInterop: true,
        sourceMap: false,
        removeComments: false
      }
    });

    const target = ext === '.tsx' ? `${base}.jsx` : `${base}.js`;
    fs.writeFileSync(target, result.outputText, 'utf8');
    fs.rmSync(source);
    migrated.push(`${path.relative(process.cwd(), source)} -> ${path.relative(process.cwd(), target)}`);
  }
}

const tsconfig = path.join(process.cwd(), 'backend', 'tsconfig.json');
if (fs.existsSync(tsconfig)) fs.rmSync(tsconfig);

console.log(`Converted ${migrated.length} TypeScript source files.`);
console.log(`Removed ${removed.length} obsolete duplicate TypeScript files.`);
for (const item of migrated) console.log(`MIGRATED ${item}`);
for (const item of removed) console.log(`REMOVED ${item}`);

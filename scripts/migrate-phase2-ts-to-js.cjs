const fs = require('fs');
const path = require('path');

// Load the compiler from an explicit package directory when provided. CI
// installs TypeScript outside the application dependency tree, so resolve the
// compiler entrypoint directly instead of relying on package-directory
// resolution behavior.
let ts;
try {
  const compilerPath = process.env.TS_COMPILER_PATH;
  if (compilerPath) {
    const compilerEntry = path.join(compilerPath, 'lib', 'typescript.js');
    ts = require(compilerEntry);
  } else {
    ts = require('typescript');
  }
} catch (error) {
  console.error('Unable to load the TypeScript compiler.');
  console.error(error.message);
  process.exit(1);
}

const roots = [
  path.join(process.cwd(), 'backend', 'src'),
  path.join(process.cwd(), 'frontend', 'src')
];
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

function walkAll(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkAll(full));
    else out.push(full);
  }
  return out;
}

for (const root of roots) {
  for (const source of walk(root)) {
    const ext = path.extname(source);
    const base = source.slice(0, -ext.length);
    const target = ext === '.tsx' ? `${base}.jsx` : `${base}.js`;

    if (fs.existsSync(target)) {
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

    fs.writeFileSync(target, result.outputText, 'utf8');
    fs.rmSync(source);
    migrated.push(`${path.relative(process.cwd(), source)} -> ${path.relative(process.cwd(), target)}`);
  }
}

for (const root of roots) {
  for (const file of walkAll(root)) {
    if (!/\.(js|jsx|mjs|cjs)$/.test(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    const updated = source
      .replace(/(["'`])([^"'`\n]+)\.tsx\1/g, '$1$2.jsx$1')
      .replace(/(["'`])([^"'`\n]+)\.ts\1/g, '$1$2.js$1');
    if (updated !== source) fs.writeFileSync(file, updated, 'utf8');
  }
}

const backendTsconfig = path.join(process.cwd(), 'backend', 'tsconfig.json');
if (fs.existsSync(backendTsconfig)) fs.rmSync(backendTsconfig);

console.log(`Converted ${migrated.length} TypeScript source files.`);
console.log(`Removed ${removed.length} obsolete duplicate TypeScript files.`);
for (const item of migrated) console.log(`MIGRATED ${item}`);
for (const item of removed) console.log(`REMOVED ${item}`);

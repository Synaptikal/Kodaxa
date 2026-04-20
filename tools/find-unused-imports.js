const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'debug') continue;
      files = files.concat(walk(full));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function analyzeFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  const imports = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('import')) continue;
    // skip import type
    if (/^import\s+type\b/.test(line)) continue;
    // collect whole import statement (multi-line)
    let j = i;
    let stmt = lines[j];
    while (!stmt.trim().endsWith(';') && j + 1 < lines.length) {
      j++;
      stmt += '\n' + lines[j];
    }
    const text = stmt;
    // skip export-from style
    if (/^export/.test(text)) continue;
    // parse simple patterns
    // default import: import Foo from 'x';
    const defaultMatch = text.match(/^import\s+([A-Za-z0-9_$]+)\s*(,|from|\{|$)/);
    const namedMatch = text.match(/import\s*\{([\s\S]*?)\}\s*from/);
    const nsMatch = text.match(/import\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from/);
    const allNames = [];
    if (defaultMatch) allNames.push(defaultMatch[1]);
    if (nsMatch) allNames.push(nsMatch[1]);
    if (namedMatch) {
      const inner = namedMatch[1];
      inner.split(',').forEach(part => {
        const p = part.trim().split(/\s+as\s+/)[0].trim();
        if (p) allNames.push(p);
      });
    }
    // ignore side-effect imports
    if (allNames.length === 0) continue;

    imports.push({ start: i, end: j, text, names: allNames });
    i = j;
  }

  const unused = [];
  for (const imp of imports) {
    const pos = src.indexOf(imp.text);
    const after = src.slice(pos + imp.text.length);
    for (const name of imp.names) {
      const re = new RegExp('\\b' + name + '\\b');
      const used = re.test(after);
      if (!used) unused.push({ name, importText: imp.text.trim(), line: imp.start + 1 });
    }
  }
  return unused.length ? { file, unused } : null;
}

const root = process.cwd();
const files = walk(root);
const results = [];
for (const f of files) {
  if (f.includes(path.join('node_modules')) || f.includes(path.join('.next'))) continue;
  const r = analyzeFile(f);
  if (r) results.push(r);
}

console.log(JSON.stringify(results, null, 2));

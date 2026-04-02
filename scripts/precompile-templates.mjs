/**
 * precompile-templates.mjs
 *
 * Build-time script: reads every .hbs file from the templates directory,
 * precompiles them with Handlebars.precompile(), and writes
 * src/features/pipelines/services/template-precompiled.ts
 *
 * The precompiled specs are plain JavaScript objects (with function literals),
 * NOT strings — so Handlebars.template(spec) at runtime requires NO eval()
 * or new Function(), making it compatible with Cloudflare Workers.
 *
 * Run: node scripts/precompile-templates.mjs
 */

import Handlebars from 'handlebars';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const templatesDir = join(rootDir, 'src/features/pipelines/templates');
const outputFile = join(rootDir, 'src/features/pipelines/services/template-precompiled.ts');

/** Recursively collect all .hbs files under a directory. */
function collectHbsFiles(dir, base = dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectHbsFiles(full, base));
    } else if (entry.name.endsWith('.hbs')) {
      // Key = path relative to templates root, using forward slashes
      const key = relative(base, full).replace(/\\/g, '/');
      files.push({ key, full });
    }
  }
  return files;
}

const files = collectHbsFiles(templatesDir);
console.log(`Precompiling ${files.length} templates...`);

const entries = files.map(({ key, full }) => {
  const source = readFileSync(full, 'utf-8');
  const spec = Handlebars.precompile(source, { knownHelpersOnly: false });
  console.log(`  ✓ ${key}`);
  return `  ${JSON.stringify(key)}: Handlebars.template(${spec})`;
});

const output = `// @ts-nocheck
/**
 * template-precompiled.ts
 *
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate by running: node scripts/precompile-templates.mjs
 *
 * Contains Handlebars templates precompiled at build time.
 * Using Handlebars.template(precompiledSpec) instead of Handlebars.compile(source)
 * avoids eval() / new Function() — required for Cloudflare Workers compatibility.
 *
 * @ts-nocheck suppresses implicit-any errors on the Handlebars-generated function params.
 */

import Handlebars from 'handlebars';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PRECOMPILED_TEMPLATES: Record<string, Handlebars.TemplateDelegate<any>> = {
${entries.join(',\n')},
};
`;

writeFileSync(outputFile, output, 'utf-8');
console.log(`\nWrote ${outputFile}`);

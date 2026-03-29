/**
 * template.service.ts
 *
 * Loads, compiles, and caches every Handlebars template found in the
 * `src/features/pipelines/templates/` directory at module-initialisation time.
 * Templates are never recompiled per request — the compiled function is reused.
 *
 * Public API
 * ----------
 * `renderTemplate(templateName, context)` — render a cached template by file name.
 */

import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { AppError } from '../../../shared/utils/app-error.js';

// ─── Resolve template directory ───────────────────────────────────────────────

/**
 * Absolute path to the `.hbs` template directory.
 *
 * Using `__dirname` (CommonJS global) because this project compiles to CJS
 * output (no `"type": "module"` in package.json).
 */
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

// ─── Handlebars helpers ───────────────────────────────────────────────────────

/**
 * `{{eq a b}}` — strict equality check for use in `{{#if (eq ...)}}` blocks.
 *
 * @example
 * ```hbs
 * {{#if (eq config.deployTarget "storage-account")}}…{{/if}}
 * ```
 */
Handlebars.registerHelper('eq', (a: unknown, b: unknown): boolean => a === b);

/**
 * `{{json value}}` — serialise a value to a pretty-printed JSON string.
 * Useful for embedding objects into template output.
 */
Handlebars.registerHelper('json', (value: unknown): string =>
  JSON.stringify(value, null, 2),
);

/**
 * `{{splitCsv str}}` — split a comma-separated string into an array so that
 * `{{#each (splitCsv ...)}}` can iterate over individual token names.
 *
 * @example
 * ```hbs
 * {{#each (splitCsv config.tokenReplacement.secretVariableNames)}}
 *   - name: {{this}}
 * {{/each}}
 * ```
 */
/**
 * `{{addOne index}}` — returns index + 1 for 1-based numbering in tables.
 */
Handlebars.registerHelper('addOne', (index: unknown): number => {
  return (typeof index === 'number' ? index : 0) + 1;
});

Handlebars.registerHelper('splitCsv', (csv: unknown): string[] => {
  if (typeof csv !== 'string' || csv.trim() === '') return [];
  return csv.split(',').map((s) => s.trim()).filter(Boolean);
});

// ─── Template cache ───────────────────────────────────────────────────────────

/** Map from template file name (e.g. `"build-pipeline.yaml.hbs"`) to compiled template function. */
const templateCache = new Map<string, Handlebars.TemplateDelegate>();

/**
 * Loads every `.hbs` file from the templates directory (and subdirectories),
 * compiles each one, and stores the result in `templateCache`.
 *
 * Subdirectory templates are keyed by their relative path from the templates
 * root, e.g. `"github-actions/gha-storage.yml.hbs"`.
 *
 * This function is called once at module initialisation time.  If a file
 * cannot be read or compiled the error propagates immediately so the process
 * fails fast rather than silently serving empty output.
 */
function loadTemplates(): void {
  loadTemplatesFromDir(TEMPLATES_DIR, '');

  if (templateCache.size === 0) {
    throw new AppError(
      `No .hbs templates found in "${TEMPLATES_DIR}". At least one template is required.`,
      500,
      false,
    );
  }
}

/**
 * Recursively walks a directory, compiling every `.hbs` file it finds and
 * storing the result in `templateCache` under a key that includes the
 * relative path prefix (e.g. `"github-actions/gha-storage.yml.hbs"`).
 *
 * @param dirPath - Absolute path to the directory to scan.
 * @param prefix - Relative path prefix accumulated from parent directories.
 */
function loadTemplatesFromDir(dirPath: string, prefix: string): void {
  let entries: string[];

  try {
    entries = fs.readdirSync(dirPath);
  } catch (err) {
    throw new AppError(
      `Failed to read templates directory at "${dirPath}": ${String(err)}`,
      500,
      false,
    );
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadTemplatesFromDir(fullPath, prefix ? `${prefix}/${entry}` : entry);
      continue;
    }

    if (!entry.endsWith('.hbs')) continue;

    const templateKey = prefix ? `${prefix}/${entry}` : entry;
    let source: string;

    try {
      source = fs.readFileSync(fullPath, 'utf-8');
    } catch (err) {
      throw new AppError(
        `Failed to read template file "${fullPath}": ${String(err)}`,
        500,
        false,
      );
    }

    try {
      templateCache.set(templateKey, Handlebars.compile(source));
    } catch (err) {
      throw new AppError(
        `Failed to compile template "${templateKey}": ${String(err)}`,
        500,
        false,
      );
    }
  }
}

// Eagerly load templates when this module is first imported.
loadTemplates();

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Renders a named Handlebars template with the supplied context object.
 *
 * @param templateName - The `.hbs` file name, e.g. `"build-pipeline.yaml.hbs"`.
 * @param context - The data object passed to the template at render time.
 * @returns The rendered string output.
 *
 * @throws {AppError} 500 if the template name is not found in the cache.
 *
 * @example
 * ```typescript
 * const yaml = renderTemplate('build-pipeline.yaml.hbs', { combination, config });
 * ```
 */
export function renderTemplate(templateName: string, context: unknown): string {
  const compiled = templateCache.get(templateName);

  if (compiled === undefined) {
    throw new AppError(
      `Template "${templateName}" not found. Available templates: ${[...templateCache.keys()].join(', ')}`,
      500,
      false,
    );
  }

  return compiled(context);
}

/**
 * Returns the names of all templates that are currently loaded in the cache.
 * Primarily useful for health checks and diagnostic logging.
 *
 * @returns An array of `.hbs` file names.
 */
export function listLoadedTemplates(): string[] {
  return [...templateCache.keys()];
}

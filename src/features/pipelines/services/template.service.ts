/**
 * template.service.ts
 *
 * Serves pre-compiled Handlebars templates to the pipeline generator.
 * No filesystem access — templates are precompiled at build time and
 * bundled as plain JavaScript functions in template-precompiled.ts.
 *
 * Using Handlebars.template(precompiledSpec) instead of Handlebars.compile(source)
 * avoids eval() / new Function() — required for Cloudflare Workers compatibility.
 *
 * Public API
 * ----------
 * `renderTemplate(templateName, context)` — render a cached template by file name.
 * `listLoadedTemplates()` — return all loaded template names.
 */

import Handlebars from 'handlebars';
import { AppError } from '../../../shared/utils/app-error.js';
import { PRECOMPILED_TEMPLATES } from './template-precompiled.js';

// ─── Handlebars helpers ───────────────────────────────────────────────────────

Handlebars.registerHelper('eq', (a: unknown, b: unknown): boolean => a === b);
Handlebars.registerHelper('json', (value: unknown): string => JSON.stringify(value, null, 2));
Handlebars.registerHelper('addOne', (index: unknown): number => (typeof index === 'number' ? index : 0) + 1);
Handlebars.registerHelper('splitCsv', (csv: unknown): string[] => {
  if (typeof csv !== 'string' || csv.trim() === '') return [];
  return csv.split(',').map((s) => s.trim()).filter(Boolean);
});

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Renders a named Handlebars template with the supplied context object.
 *
 * @param templateName - The `.hbs` file name, e.g. `"build-pipeline.yaml.hbs"`.
 * @param context - The data object passed to the template at render time.
 * @returns The rendered string output.
 *
 * @throws {AppError} 500 if the template name is not found.
 */
export function renderTemplate(templateName: string, context: unknown): string {
  const delegate = PRECOMPILED_TEMPLATES[templateName];
  if (delegate === undefined) {
    throw new AppError(
      `Template "${templateName}" not found. Available: ${Object.keys(PRECOMPILED_TEMPLATES).join(', ')}`,
      500,
      false,
    );
  }
  return delegate(context as Record<string, unknown>);
}

/**
 * Returns the names of all templates that are currently loaded.
 */
export function listLoadedTemplates(): string[] {
  return Object.keys(PRECOMPILED_TEMPLATES);
}

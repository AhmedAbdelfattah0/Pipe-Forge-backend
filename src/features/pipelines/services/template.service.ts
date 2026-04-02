/**
 * template.service.ts
 *
 * Compiles and caches every Handlebars template from the static template bundle.
 * No filesystem access — templates are imported as string constants for
 * Cloudflare Workers compatibility.
 *
 * Public API
 * ----------
 * `renderTemplate(templateName, context)` — render a cached template by file name.
 * `listLoadedTemplates()` — return all loaded template names.
 */

import Handlebars from 'handlebars';
import { AppError } from '../../../shared/utils/app-error.js';
import { TEMPLATE_SOURCES } from './template-sources.js';

// ─── Handlebars helpers ───────────────────────────────────────────────────────

Handlebars.registerHelper('eq', (a: unknown, b: unknown): boolean => a === b);
Handlebars.registerHelper('json', (value: unknown): string => JSON.stringify(value, null, 2));
Handlebars.registerHelper('addOne', (index: unknown): number => (typeof index === 'number' ? index : 0) + 1);
Handlebars.registerHelper('splitCsv', (csv: unknown): string[] => {
  if (typeof csv !== 'string' || csv.trim() === '') return [];
  return csv.split(',').map((s) => s.trim()).filter(Boolean);
});

// ─── Template cache ───────────────────────────────────────────────────────────

const templateCache = new Map<string, Handlebars.TemplateDelegate>();

// Compile all templates from static sources
for (const [name, source] of Object.entries(TEMPLATE_SOURCES)) {
  templateCache.set(name, Handlebars.compile(source));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Renders a named Handlebars template with the supplied context object.
 *
 * @param templateName - The `.hbs` file name, e.g. `"build-pipeline.yaml.hbs"`.
 * @param context - The data object passed to the template at render time.
 * @returns The rendered string output.
 *
 * @throws {AppError} 500 if the template name is not found in the cache.
 */
export function renderTemplate(templateName: string, context: unknown): string {
  const compiled = templateCache.get(templateName);
  if (compiled === undefined) {
    throw new AppError(
      `Template "${templateName}" not found. Available: ${[...templateCache.keys()].join(', ')}`,
      500,
      false,
    );
  }
  return compiled(context);
}

/**
 * Returns the names of all templates that are currently loaded in the cache.
 */
export function listLoadedTemplates(): string[] {
  return [...templateCache.keys()];
}

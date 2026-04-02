/**
 * validator.service.ts
 *
 * Stateless static-analysis engine for Azure DevOps and GitHub Actions pipeline files.
 * Applies a rule-set, computes a health score, and can auto-fix common issues.
 */

export type Platform = 'ado' | 'gha';
export type Severity = 'critical' | 'warning' | 'info' | 'passing';

export interface ValidationIssue {
  severity: Severity;
  code: string;
  description: string;
  line?: number;
  suggestion: string;
  autoFixable: boolean;
}

export interface ValidationResult {
  platform: Platform;
  healthScore: number;
  issues: ValidationIssue[];
}

export interface FixResult {
  fixed: string;
  changelog: string;
}

// ── Rule definitions ────────────────────────────────────────────────────────

interface Rule {
  code: string;
  severity: Severity;
  description: string;
  suggestion: string;
  platforms: Platform[];
  autoFixable: boolean;
  detect(content: string): { matched: boolean; line?: number };
  fix?(content: string): string;
}

const RULES: Rule[] = [
  // ── ADO rules ─────────────────────────────────────────────────────────────

  {
    code: 'ADO001',
    severity: 'critical',
    description: 'AzureCLI@1 is deprecated — use AzureCLI@2.',
    suggestion: 'Replace "AzureCLI@1" with "AzureCLI@2" in all task steps.',
    platforms: ['ado'],
    autoFixable: true,
    detect: (c) => {
      const idx = c.indexOf('AzureCLI@1');
      if (idx === -1) return { matched: false };
      const line = c.slice(0, idx).split('\n').length;
      return { matched: true, line };
    },
    fix: (c) => c.replaceAll('AzureCLI@1', 'AzureCLI@2'),
  },

  {
    code: 'ADO002',
    severity: 'warning',
    description: 'Node.js version is below 18 (end of life).',
    suggestion: 'Update the NodeTool or UseNode step to version 20 or 22.',
    platforms: ['ado'],
    autoFixable: false,
    detect: (c) => {
      const match = /version:\s*['"]?(1[0-7])\b/.exec(c);
      if (!match) return { matched: false };
      const idx = c.indexOf(match[0]);
      const line = c.slice(0, idx).split('\n').length;
      return { matched: true, line };
    },
  },

  {
    code: 'ADO003',
    severity: 'info',
    description: 'npm cache step is missing — builds may be slower than necessary.',
    suggestion: 'Add a Cache task before npm ci to restore node_modules between runs.',
    platforms: ['ado'],
    autoFixable: false,
    detect: (c) => ({ matched: !c.includes('Cache@') && c.includes('npm') }),
  },

  {
    code: 'ADO004',
    severity: 'info',
    description: 'npm install detected — prefer npm ci in CI pipelines.',
    suggestion: 'Replace "npm install" with "npm ci" for deterministic, faster installs.',
    platforms: ['ado'],
    autoFixable: true,
    detect: (c) => {
      const idx = c.indexOf('npm install');
      if (idx === -1) return { matched: false };
      const line = c.slice(0, idx).split('\n').length;
      return { matched: true, line };
    },
    fix: (c) => c.replaceAll('npm install', 'npm ci'),
  },

  // ── GHA rules ─────────────────────────────────────────────────────────────

  {
    code: 'GHA001',
    severity: 'warning',
    description: 'actions/checkout@v2 or @v3 is outdated.',
    suggestion: 'Upgrade to "actions/checkout@v4" for security and performance improvements.',
    platforms: ['gha'],
    autoFixable: true,
    detect: (c) => {
      const match = /actions\/checkout@v[23]/.exec(c);
      if (!match) return { matched: false };
      const idx = c.indexOf(match[0]);
      const line = c.slice(0, idx).split('\n').length;
      return { matched: true, line };
    },
    fix: (c) => c.replace(/actions\/checkout@v[23]/g, 'actions/checkout@v4'),
  },

  {
    code: 'GHA002',
    severity: 'warning',
    description: 'actions/setup-node@v3 is outdated.',
    suggestion: 'Upgrade to "actions/setup-node@v4" for the latest features and fixes.',
    platforms: ['gha'],
    autoFixable: true,
    detect: (c) => {
      const match = /actions\/setup-node@v3/.exec(c);
      if (!match) return { matched: false };
      const idx = c.indexOf(match[0]);
      const line = c.slice(0, idx).split('\n').length;
      return { matched: true, line };
    },
    fix: (c) => c.replace(/actions\/setup-node@v3/g, 'actions/setup-node@v4'),
  },

  {
    code: 'GHA003',
    severity: 'info',
    description: 'npm cache is not configured for setup-node.',
    suggestion: 'Add "cache: npm" to your actions/setup-node step to speed up CI runs.',
    platforms: ['gha'],
    autoFixable: false,
    detect: (c) => ({
      matched: c.includes('setup-node') && !c.includes("cache: 'npm'") && !c.includes('cache: npm'),
    }),
  },

  {
    code: 'GHA004',
    severity: 'info',
    description: 'npm install detected — prefer npm ci in CI pipelines.',
    suggestion: 'Replace "npm install" with "npm ci" for deterministic, faster installs.',
    platforms: ['gha'],
    autoFixable: true,
    detect: (c) => {
      const idx = c.indexOf('npm install');
      if (idx === -1) return { matched: false };
      const line = c.slice(0, idx).split('\n').length;
      return { matched: true, line };
    },
    fix: (c) => c.replaceAll('npm install', 'npm ci'),
  },

  {
    code: 'GHA005',
    severity: 'info',
    description: 'No timeout-minutes set on jobs.',
    suggestion: 'Add "timeout-minutes: 15" (or an appropriate value) to each job to prevent runaway builds from consuming CI minutes.',
    platforms: ['gha'],
    autoFixable: false,
    detect: (c) => ({ matched: c.includes('jobs:') && !c.includes('timeout-minutes') }),
  },

  // ── Both platforms ─────────────────────────────────────────────────────────

  {
    code: 'CMN001',
    severity: 'warning',
    description: 'Node.js 14 or 16 detected — both are end of life.',
    suggestion: 'Upgrade to Node.js 20 or 22 (current LTS releases).',
    platforms: ['ado', 'gha'],
    autoFixable: false,
    detect: (c) => {
      const match = /node(?:-version)?[:\s]+['"]?(14|16)\b/.exec(c);
      if (!match) return { matched: false };
      const idx = c.indexOf(match[0]);
      const line = c.slice(0, idx).split('\n').length;
      return { matched: true, line };
    },
  },

  {
    code: 'CMN002',
    severity: 'critical',
    description: 'Possible hardcoded secret detected in file.',
    suggestion: 'Move secrets to CI secret variables. Never commit credentials to source control.',
    platforms: ['ado', 'gha'],
    autoFixable: false,
    detect: (c) => {
      // Look for obvious patterns: password=, token=, apikey= followed by a non-variable value.
      const pattern = /(?:password|token|api[_-]?key|secret)\s*[:=]\s*['"]?[A-Za-z0-9+/]{16,}/i;
      const match = pattern.exec(c);
      if (!match) return { matched: false };
      const idx = c.indexOf(match[0]);
      const line = c.slice(0, idx).split('\n').length;
      return { matched: true, line };
    },
  },
];

// ── Score weights ────────────────────────────────────────────────────────────

const DEDUCTIONS: Record<Severity, number> = {
  critical: 30,
  warning: 10,
  info: 5,
  passing: 0,
};

// ── Service ──────────────────────────────────────────────────────────────────

export class ValidatorService {
  /**
   * Detect the CI platform from file content.
   * Explicit hint takes priority; falls back to heuristics.
   */
  detectPlatform(content: string, hint?: 'ado' | 'gha'): Platform {
    if (hint === 'ado' || hint === 'gha') return hint;
    if (content.includes('runs-on:')) return 'gha';
    if (content.includes('task:') || content.includes('steps:') && content.includes('- task')) return 'ado';
    // Default to GHA for YAML without strong signals.
    return 'gha';
  }

  /**
   * Run all applicable rules and compute a health score.
   */
  analyse(content: string, platformHint?: 'ado' | 'gha'): ValidationResult {
    const platform = this.detectPlatform(content, platformHint);
    const issues: ValidationIssue[] = [];

    for (const rule of RULES) {
      if (!rule.platforms.includes(platform)) continue;

      const { matched, line } = rule.detect(content);
      if (matched) {
        issues.push({
          severity: rule.severity,
          code: rule.code,
          description: rule.description,
          line,
          suggestion: rule.suggestion,
          autoFixable: rule.autoFixable,
        });
      }
    }

    // Compute score: start at 100, deduct per issue.
    let score = 100;
    for (const issue of issues) {
      score -= DEDUCTIONS[issue.severity];
    }
    const healthScore = Math.max(0, score);

    return { platform, healthScore, issues };
  }

  /**
   * Apply all auto-fixable rules in sequence and produce a changelog.
   */
  fix(content: string, platformHint?: 'ado' | 'gha'): FixResult {
    const platform = this.detectPlatform(content, platformHint);
    let fixed = content;
    const applied: string[] = [];

    for (const rule of RULES) {
      if (!rule.platforms.includes(platform)) continue;
      if (!rule.autoFixable || !rule.fix) continue;

      const { matched } = rule.detect(fixed);
      if (matched) {
        fixed = rule.fix(fixed);
        applied.push(`[${rule.code}] ${rule.description}`);
      }
    }

    const changelog = applied.length
      ? `Auto-fixes applied by PipeForge Validator\n${'='.repeat(45)}\n\n${applied.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
      : 'No auto-fixable issues were found.';

    return { fixed, changelog };
  }
}

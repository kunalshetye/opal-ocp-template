/**
 * Scaffold step - copy template and replace placeholders
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { Context, TemplateTokens } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to copy from template
const TEMPLATE_FILES = [
  'app.yml',
  'package.json',
  'tsconfig.json',
  '.gitignore',
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'src/index.ts',
  'src/functions/OpalToolFunction.ts',
  'src/lifecycle/Lifecycle.ts',
  'forms/settings.yml',
  'assets/icon.svg',
  'assets/logo.svg',
  'assets/directory/overview.md',
];

export async function scaffold(
  ctx: Pick<
    Context,
    | 'cwd'
    | 'appId'
    | 'appDisplayName'
    | 'appDescription'
    | 'appSummary'
    | 'trackerId'
    | 'githubUsername'
    | 'repoName'
    | 'contactEmail'
    | 'toolDescription'
    | 'dryRun'
  >
): Promise<void> {
  const spinner = p.spinner();
  spinner.start('Scaffolding project...');

  try {
    const templateDir = path.resolve(__dirname, '../../template');
    const targetDir = path.resolve(ctx.cwd);

    // Create token replacements
    const tokens: TemplateTokens = {
      '{{APP_ID}}': ctx.appId,
      '{{APP_DISPLAY_NAME}}': ctx.appDisplayName,
      '{{APP_DESCRIPTION}}': ctx.appDescription,
      '{{APP_SUMMARY}}': ctx.appSummary,
      '{{TRACKER_ID}}': ctx.trackerId,
      '{{GITHUB_USERNAME}}': ctx.githubUsername,
      '{{REPO_NAME}}': ctx.repoName,
      '{{CONTACT_EMAIL}}': ctx.contactEmail,
      '{{TOOL_DESCRIPTION}}': ctx.toolDescription,
    };

    if (ctx.dryRun) {
      spinner.stop(`${pc.dim('[dry-run]')} Would scaffold to ${targetDir}`);
      p.log.info(pc.dim('Token replacements:'));
      for (const [token, value] of Object.entries(tokens)) {
        p.log.info(pc.dim(`  ${token} → ${value}`));
      }
      return;
    }

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy and process each file
    for (const file of TEMPLATE_FILES) {
      const srcPath = path.join(templateDir, file);
      const destPath = path.join(targetDir, file);

      // Create directory if needed
      const destDir = path.dirname(destPath);
      fs.mkdirSync(destDir, { recursive: true });

      // Read, replace tokens, write
      if (fs.existsSync(srcPath)) {
        let content = fs.readFileSync(srcPath, 'utf-8');
        content = replaceTokens(content, tokens);
        fs.writeFileSync(destPath, content, 'utf-8');
      }
    }

    spinner.stop('Project scaffolded!');
  } catch (error) {
    spinner.stop('Failed to scaffold project');
    throw error;
  }
}

/**
 * Replace all template tokens in content
 */
function replaceTokens(content: string, tokens: TemplateTokens): string {
  let result = content;
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replace(new RegExp(escapeRegex(token), 'g'), value);
  }
  return result;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

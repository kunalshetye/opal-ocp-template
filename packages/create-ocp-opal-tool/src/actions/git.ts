/**
 * Git initialization step
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { Context } from '../types.js';
import { shell, commandExists } from '../utils/shell.js';

export async function git(
  ctx: Pick<Context, 'cwd' | 'git' | 'yes' | 'dryRun' | 'exit'>
): Promise<void> {
  // Check if git is available
  const hasGit = await commandExists('git');
  if (!hasGit) {
    p.log.warn('Git is not installed. Skipping repository initialization.');
    ctx.git = false;
    return;
  }

  // Already decided via CLI flag
  if (ctx.git !== undefined) {
    if (ctx.git) {
      await initGit(ctx);
    }
    return;
  }

  // In yes mode, default to initializing git
  if (ctx.yes) {
    ctx.git = true;
    await initGit(ctx);
    return;
  }

  // Interactive prompt
  const shouldInit = await p.confirm({
    message: 'Initialize a git repository?',
    initialValue: true,
  });

  if (p.isCancel(shouldInit)) {
    p.cancel('Operation cancelled.');
    ctx.exit(0);
  }

  ctx.git = shouldInit as boolean;

  if (ctx.git) {
    await initGit(ctx);
  }
}

async function initGit(
  ctx: Pick<Context, 'cwd' | 'dryRun'>
): Promise<void> {
  if (ctx.dryRun) {
    p.log.info(`${pc.dim('[dry-run]')} Would initialize git repository`);
    return;
  }

  const spinner = p.spinner();
  spinner.start('Initializing git repository...');

  try {
    const cwd = ctx.cwd;

    // Initialize git
    await shell('git', ['init'], { cwd });

    // Create initial commit
    await shell('git', ['add', '-A'], { cwd });
    await shell('git', ['commit', '-m', 'Initial commit from create-ocp-opal-tool'], { cwd });

    spinner.stop('Git repository initialized!');
  } catch (error) {
    spinner.stop('Failed to initialize git repository');
    p.log.warn('Git initialization failed. You can initialize it manually later.');
  }
}

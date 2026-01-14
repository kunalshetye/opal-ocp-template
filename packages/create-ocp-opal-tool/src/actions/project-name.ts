/**
 * Project name step - get project directory
 */

import path from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { Context } from '../types.js';
import { isEmpty, toValidAppId, hasNonPrintableChars } from '../utils/validation.js';

export async function projectName(
  ctx: Pick<Context, 'cwd' | 'projectName' | 'yes' | 'dryRun' | 'exit'>
): Promise<void> {
  // If cwd was provided and is empty, use it
  if (ctx.cwd && isEmpty(ctx.cwd)) {
    ctx.projectName = extractProjectName(ctx.cwd);
    p.log.info(
      `${pc.cyan('Directory:')} Using ${pc.bold(ctx.cwd)} as project directory`
    );
    return;
  }

  // If cwd was provided but not empty, warn
  if (ctx.cwd && !isEmpty(ctx.cwd)) {
    p.log.warn(`${pc.yellow(`"${ctx.cwd}"`)} is not empty!`);
  }

  // In yes mode, generate a name
  if (ctx.yes) {
    ctx.projectName = generateProjectName();
    ctx.cwd = `./${ctx.projectName}`;
    p.log.info(`${pc.cyan('Directory:')} Creating project at ${pc.bold(ctx.cwd)}`);
    return;
  }

  // Interactive prompt
  const name = await p.text({
    message: 'Where should we create your OCP Opal Tool?',
    placeholder: './my-ocp-opal-tool',
    defaultValue: './my-ocp-opal-tool',
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Please enter a directory name';
      }
      if (hasNonPrintableChars(value)) {
        return 'Invalid characters in directory name';
      }
      if (!isEmpty(value)) {
        return 'Directory is not empty!';
      }
      return undefined;
    },
  });

  if (p.isCancel(name)) {
    p.cancel('Operation cancelled.');
    ctx.exit(0);
  }

  ctx.cwd = (name as string).trim();
  ctx.projectName = extractProjectName(ctx.cwd);

  if (ctx.dryRun) {
    p.log.info(`${pc.dim('[dry-run]')} Would create project at ${ctx.cwd}`);
  }
}

/**
 * Extract project name from path
 */
function extractProjectName(cwd: string): string {
  let name = cwd;

  if (name === '.' || name === './') {
    // Use current directory name
    const parts = process.cwd().split(path.sep);
    name = parts[parts.length - 1];
  } else {
    // Extract the last segment from the path (works for both relative and absolute)
    name = path.basename(name);
  }

  return toValidAppId(name);
}

/**
 * Generate a random project name
 */
function generateProjectName(): string {
  const adjectives = ['smart', 'fast', 'clever', 'bright', 'swift', 'agile'];
  const nouns = ['tool', 'helper', 'assistant', 'agent', 'bot', 'service'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `ocp-opal-${adj}-${noun}-${num}`;
}

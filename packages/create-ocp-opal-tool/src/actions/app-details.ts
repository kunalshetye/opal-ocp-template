/**
 * App details step - collect OCP app configuration
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { Context } from '../types.js';
import {
  toValidAppId,
  toDisplayName,
  isValidEmail,
  isValidGithubUsername,
} from '../utils/validation.js';
import { getGitUser } from '../utils/shell.js';

export async function appDetails(
  ctx: Pick<
    Context,
    | 'projectName'
    | 'appId'
    | 'appDisplayName'
    | 'appDescription'
    | 'appSummary'
    | 'toolDescription'
    | 'githubUsername'
    | 'repoName'
    | 'contactEmail'
    | 'yes'
    | 'dryRun'
    | 'exit'
  >
): Promise<void> {
  // Get git user for defaults
  const gitUser = await getGitUser();

  // In yes mode, use defaults
  if (ctx.yes) {
    ctx.appId = ctx.projectName;
    ctx.appDisplayName = toDisplayName(ctx.projectName);
    ctx.appDescription = 'An OCP Opal Tool';
    ctx.appSummary = 'Extends Opal with custom functionality';
    ctx.toolDescription = 'A custom tool for Opal';
    ctx.githubUsername = 'your-username';
    ctx.repoName = ctx.projectName;
    ctx.contactEmail = gitUser.email || 'your-email@example.com';
    return;
  }

  p.log.step(pc.cyan('App Configuration'));

  const appConfig = await p.group(
    {
      appId: () =>
        p.text({
          message: 'App ID (unique identifier for OCP)',
          placeholder: ctx.projectName,
          defaultValue: ctx.projectName,
          validate: (value) => {
            const valid = toValidAppId(value);
            if (valid !== value.toLowerCase().trim()) {
              return `Will be normalized to: ${valid}`;
            }
            if (valid.length === 0) {
              return 'App ID is required';
            }
            return undefined;
          },
        }),

      appDisplayName: ({ results }) =>
        p.text({
          message: 'Display name (shown in OCP)',
          placeholder: toDisplayName(results.appId || ctx.projectName),
          defaultValue: toDisplayName(results.appId || ctx.projectName),
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Display name is required';
            }
            if (value.length > 50) {
              return 'Display name should be 50 characters or less';
            }
            return undefined;
          },
        }),

      appDescription: () =>
        p.text({
          message: 'Description (what does your tool do?)',
          placeholder: 'An OCP Opal Tool that...',
          defaultValue: 'An OCP Opal Tool',
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Description is required';
            }
            return undefined;
          },
        }),

      appSummary: () =>
        p.text({
          message: 'Summary (brief one-liner for app listing)',
          placeholder: 'Extends Opal with custom functionality',
          defaultValue: 'Extends Opal with custom functionality',
        }),

      toolDescription: () =>
        p.text({
          message: 'Tool description (what will Opal see?)',
          placeholder: 'A tool that helps users...',
          defaultValue: 'A custom tool for Opal',
        }),
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        ctx.exit(0);
      },
    }
  );

  ctx.appId = toValidAppId(appConfig.appId as string);
  ctx.appDisplayName = (appConfig.appDisplayName as string).trim();
  ctx.appDescription = (appConfig.appDescription as string).trim();
  ctx.appSummary = (appConfig.appSummary as string).trim();
  ctx.toolDescription = (appConfig.toolDescription as string).trim();

  // Repository and contact info
  p.log.step(pc.cyan('Repository & Contact'));

  const repoConfig = await p.group(
    {
      githubUsername: () =>
        p.text({
          message: 'GitHub username (for repository URL)',
          placeholder: 'your-username',
          defaultValue: '',
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return undefined; // Optional
            }
            if (!isValidGithubUsername(value)) {
              return 'Invalid GitHub username format';
            }
            return undefined;
          },
        }),

      repoName: ({ results }) =>
        p.text({
          message: 'Repository name',
          placeholder: ctx.appId,
          defaultValue: ctx.appId,
        }),

      contactEmail: () =>
        p.text({
          message: 'Contact email (for support)',
          placeholder: gitUser.email || 'your-email@example.com',
          defaultValue: gitUser.email || '',
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Contact email is required';
            }
            if (!isValidEmail(value)) {
              return 'Invalid email format';
            }
            return undefined;
          },
        }),
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        ctx.exit(0);
      },
    }
  );

  ctx.githubUsername = (repoConfig.githubUsername as string).trim() || 'your-username';
  ctx.repoName = (repoConfig.repoName as string).trim();
  ctx.contactEmail = (repoConfig.contactEmail as string).trim();

  if (ctx.dryRun) {
    p.log.info(`${pc.dim('[dry-run]')} Collected app details`);
  }
}

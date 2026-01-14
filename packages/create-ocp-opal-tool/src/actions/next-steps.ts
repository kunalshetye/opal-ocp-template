/**
 * Next steps - show completion message and helpful commands
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { Context } from '../types.js';

export async function nextSteps(
  ctx: Pick<
    Context,
    'cwd' | 'packageManager' | 'install' | 'git' | 'appDisplayName' | 'trackerId'
  >
): Promise<void> {
  const projectDir = ctx.cwd.startsWith('./') ? ctx.cwd.slice(2) : ctx.cwd;

  console.log('');
  
  // First, show OCP CLI setup if needed
  p.note(
    [
      pc.cyan('Install OCP CLI (if not already installed):'),
      '',
      `  ${pc.dim('# Create credentials file with your API key')}`,
      `  ${pc.dim('$')} mkdir -p ~/.ocp`,
      `  ${pc.dim('$')} echo '{"apiKey": "<YOUR_API_KEY>"}' > ~/.ocp/credentials.json`,
      '',
      `  ${pc.dim('# Install OCP CLI globally')}`,
      `  ${pc.dim('$')} yarn global add @optimizely/ocp-cli`,
      `  ${pc.dim('$')} export PATH="$(yarn global bin):$PATH"`,
      '',
      `  ${pc.dim('# Verify installation')}`,
      `  ${pc.dim('$')} ocp accounts whoami`,
      '',
      pc.dim('Get your API key from your OCP developer invitation email.'),
      pc.dim('Docs: https://docs.developers.optimizely.com/optimizely-connect-platform/docs/configure-your-development-environment-ocp2'),
    ].join('\n'),
    'OCP CLI Setup'
  );

  console.log('');
  
  p.note(
    [
      pc.bold(`Your OCP Opal Tool "${ctx.appDisplayName}" is ready!`),
      '',
      pc.cyan('Next steps:'),
      '',
      // cd into directory if not current dir
      projectDir !== '.' ? `  ${pc.dim('$')} cd ${projectDir}` : null,
      // Always show yarn install (OCP requires Yarn 1.x)
      `  ${pc.dim('$')} yarn install`,
      // Build
      `  ${pc.dim('$')} yarn build`,
      // Validate
      `  ${pc.dim('$')} yarn validate`,
      '',
      pc.cyan('Deploy to OCP:'),
      '',
      `  ${pc.dim('$')} ocp app register`,
      `  ${pc.dim('$')} ocp app prepare`,
      ctx.trackerId !== 'YOUR_TRACKER_ID'
        ? `  ${pc.dim('$')} ocp directory install <APP_ID>@<VERSION> ${ctx.trackerId}`
        : `  ${pc.dim('$')} ocp directory install <APP_ID>@<VERSION> <TRACKER_ID>`,
      '',
      pc.dim('Note: OCP requires Yarn 1.x (Classic)'),
      pc.dim('Learn more: https://docs.developers.optimizely.com/'),
    ]
      .filter(Boolean)
      .join('\n'),
    'Success!'
  );

  p.outro(
    `Problems? ${pc.cyan('https://github.com/kunalshetye/opal-ocp-template/issues')}`
  );
}

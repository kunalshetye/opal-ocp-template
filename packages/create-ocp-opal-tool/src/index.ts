/**
 * @kunalshetye/ocp-opal-wizard
 *
 * CLI wizard to scaffold Optimizely Connect Platform (OCP) Opal Tools
 *
 * Usage: npx @kunalshetye/ocp-opal-wizard create [directory] [options]
 */

import * as p from '@clack/prompts';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getContext } from './actions/context.js';
import { help } from './actions/help.js';
import { intro } from './actions/intro.js';
import { projectName } from './actions/project-name.js';
import { appDetails } from './actions/app-details.js';
import { trackerId } from './actions/tracker-id.js';
import { scaffold } from './actions/scaffold.js';
import { dependencies } from './actions/dependencies.js';
import { git } from './actions/git.js';
import { nextSteps } from './actions/next-steps.js';

// Handle process signals
const exit = () => process.exit(0);
process.on('SIGINT', exit);
process.on('SIGTERM', exit);

/**
 * Run the create wizard
 */
async function runCreate(argv: string[]): Promise<void> {
  // Parse arguments and create context
  const ctx = await getContext(argv);

  // Show help if requested
  if (ctx.help) {
    help();
    return;
  }

  try {
    // Run wizard steps
    await intro(ctx);
    await projectName(ctx);
    await appDetails(ctx);
    await trackerId(ctx);

    // Scaffold the project
    await scaffold(ctx);

    // Post-scaffold steps (order matters: deps before git for cleaner commits)
    await dependencies(ctx);
    await git(ctx);

    // Show next steps
    await nextSteps(ctx);
  } catch (error) {
    p.cancel('An error occurred.');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }

  process.exit(0);
}

export async function main(): Promise<void> {
  // Add spacing from noisy npm/pnpm output
  console.log('');

  // Filter out '--' that npm passes through
  const cleanArgv = process.argv.filter((arg) => arg !== '--');

  // Parse with yargs to handle subcommands
  await yargs(hideBin(cleanArgv))
    .scriptName('ocp-opal-wizard')
    .usage('$0 <command> [options]')
    .command(
      'create [directory]',
      'Create a new OCP Opal Tool project',
      (yargs) => {
        return yargs
          .positional('directory', {
            type: 'string',
            description: 'Project directory',
          })
          .option('yes', {
            alias: 'y',
            type: 'boolean',
            description: 'Skip prompts, use defaults',
            default: false,
          })
          .option('no', {
            alias: 'n',
            type: 'boolean',
            description: 'Skip prompts, decline all',
            default: false,
          })
          .option('install', {
            type: 'boolean',
            description: 'Install dependencies',
          })
          .option('no-install', {
            type: 'boolean',
            description: 'Skip dependency installation',
          })
          .option('git', {
            type: 'boolean',
            description: 'Initialize git repository',
          })
          .option('no-git', {
            type: 'boolean',
            description: 'Skip git initialization',
          })
          .option('dry-run', {
            type: 'boolean',
            description: 'Show what would be done',
            default: false,
          })
          .option('app-id', {
            type: 'string',
            description: 'OCP App ID',
          })
          .option('display-name', {
            type: 'string',
            description: 'App display name',
          })
          .option('description', {
            type: 'string',
            description: 'App description',
          })
          .option('summary', {
            type: 'string',
            description: 'App summary',
          })
          .option('tracker-id', {
            type: 'string',
            description: 'OCP Tracker ID',
          })
          .option('email', {
            type: 'string',
            description: 'Contact email',
          })
          .option('github-user', {
            type: 'string',
            description: 'GitHub username',
          });
      },
      async () => {
        // Pass the original argv to runCreate (it will re-parse for context)
        await runCreate(cleanArgv);
      }
    )
    .demandCommand(1, 'You need to specify a command. Try: ocp-opal-wizard create')
    .recommendCommands()
    .strict()
    .help('help')
    .alias('h', 'help')
    .version('1.0.0')
    .alias('v', 'version')
    .parse();
}

// Export actions for testing
export {
  getContext,
  help,
  intro,
  projectName,
  appDetails,
  trackerId,
  scaffold,
  dependencies,
  git,
  nextSteps,
};

/**
 * Context initialization - parse CLI arguments and set up context
 */

import type { Context } from '../types.js';
import { detectPackageManager } from '../utils/package-manager.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export async function getContext(argv: string[]): Promise<Context> {
  const args = await yargs(hideBin(argv))
    .scriptName('ocp-opal-wizard')
    .usage('$0 create [directory] [options]')
    .command('create [directory]', 'Create a new OCP Opal Tool project')
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
    })
    .help('help')
    .alias('h', 'help')
    .version('1.0.0')
    .alias('v', 'version')
    .parse();

  const packageManager = detectPackageManager();
  
  // Extract directory from positional args or from yargs parsed 'directory'
  // When using subcommands, yargs may put the positional in args.directory
  // or in args._ as ['create', 'directory']
  const positionalArgs = args._ as string[];
  let cwd = '';
  
  // Check if directory was parsed as a named positional
  if (args.directory && typeof args.directory === 'string') {
    cwd = args.directory;
  } 
  // Otherwise check positional args array (after 'create' command)
  else if (positionalArgs.length > 1 && positionalArgs[0] === 'create') {
    cwd = String(positionalArgs[1]);
  }

  // Handle --no flag
  let yes = args.yes;
  let install = args.install;
  let git = args.git;

  if (args.no) {
    yes = false;
    install = install ?? false;
    git = git ?? false;
  }

  if (args['no-install']) {
    install = false;
  }

  if (args['no-git']) {
    git = false;
  }

  const context: Context = {
    help: args.help as boolean,
    cwd,
    packageManager,
    projectName: '',
    yes,
    dryRun: args['dry-run'] ?? false,
    install: install as boolean | undefined as boolean,
    git: git as boolean | undefined as boolean,

    // OCP-specific (will be populated by wizard or CLI args)
    appId: (args['app-id'] as string) || '',
    appDisplayName: (args['display-name'] as string) || '',
    appDescription: (args.description as string) || '',
    appSummary: (args.summary as string) || '',
    trackerId: (args['tracker-id'] as string) || '',
    githubUsername: (args['github-user'] as string) || '',
    repoName: '',
    contactEmail: (args.email as string) || '',
    toolDescription: '',

    exit(code: number): never {
      process.exit(code);
    },
  };

  return context;
}

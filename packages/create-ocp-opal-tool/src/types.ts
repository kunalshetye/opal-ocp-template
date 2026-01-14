/**
 * Context object passed through all wizard steps.
 * Contains user inputs and configuration state.
 */
export interface Context {
  /** Show help and exit */
  help: boolean;
  /** Current working directory for the new project */
  cwd: string;
  /** Detected package manager (npm, yarn, pnpm, bun) */
  packageManager: string;
  /** Project directory name */
  projectName: string;
  /** Skip interactive prompts, use defaults */
  yes: boolean;
  /** Dry run mode - don't write files */
  dryRun: boolean;
  /** Install dependencies after scaffolding */
  install: boolean;
  /** Initialize git repository */
  git: boolean;

  // OCP-specific configuration
  /** OCP App ID (e.g., "my-opal-tool") */
  appId: string;
  /** Display name shown in OCP (e.g., "My Opal Tool") */
  appDisplayName: string;
  /** Short description of the app */
  appDescription: string;
  /** Brief summary for app listing */
  appSummary: string;
  /** OCP Tracker ID for deployment */
  trackerId: string;
  /** GitHub username for repository URL */
  githubUsername: string;
  /** Repository name */
  repoName: string;
  /** Contact email for support */
  contactEmail: string;
  /** Description of what the tool does */
  toolDescription: string;

  /** Exit function */
  exit: (code: number) => never;
}

/**
 * Partial context for individual wizard steps
 */
export type StepContext<K extends keyof Context> = Pick<Context, K> & {
  exit: (code: number) => never;
};

/**
 * Template placeholder tokens
 */
export interface TemplateTokens {
  '{{APP_ID}}': string;
  '{{APP_DISPLAY_NAME}}': string;
  '{{APP_DESCRIPTION}}': string;
  '{{APP_SUMMARY}}': string;
  '{{TRACKER_ID}}': string;
  '{{GITHUB_USERNAME}}': string;
  '{{REPO_NAME}}': string;
  '{{CONTACT_EMAIL}}': string;
  '{{TOOL_DESCRIPTION}}': string;
}

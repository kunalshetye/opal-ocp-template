/**
 * Detect the package manager used to invoke this CLI.
 * Checks the npm_config_user_agent environment variable.
 */
export function detectPackageManager(): string {
  const userAgent = process.env.npm_config_user_agent;
  if (!userAgent) return 'npm';

  const specifier = userAgent.split(' ')[0];
  const name = specifier.substring(0, specifier.lastIndexOf('/'));

  switch (name) {
    case 'yarn':
      return 'yarn';
    case 'pnpm':
      return 'pnpm';
    case 'bun':
      return 'bun';
    case 'npminstall':
      return 'cnpm';
    default:
      return 'npm';
  }
}

/**
 * Get the run command for a package manager
 */
export function getRunCommand(pm: string): string {
  switch (pm) {
    case 'yarn':
      return 'yarn';
    case 'pnpm':
      return 'pnpm';
    case 'bun':
      return 'bun run';
    default:
      return 'npm run';
  }
}

/**
 * Get the install command for a package manager
 */
export function getInstallCommand(pm: string): string {
  switch (pm) {
    case 'yarn':
      return 'yarn';
    case 'pnpm':
      return 'pnpm install';
    case 'bun':
      return 'bun install';
    default:
      return 'npm install';
  }
}

/**
 * Get the execute command for running binaries (like create-* commands)
 */
export function getExecCommand(pm: string): string {
  switch (pm) {
    case 'yarn':
      return 'yarn dlx';
    case 'pnpm':
      return 'pnpm dlx';
    case 'bun':
      return 'bunx';
    default:
      return 'npx';
  }
}

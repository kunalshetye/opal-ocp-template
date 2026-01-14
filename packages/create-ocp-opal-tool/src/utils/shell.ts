/**
 * Shell execution utilities
 */

import { spawn } from 'node:child_process';

export interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Execute a shell command and return the result
 */
export function shell(
  command: string,
  args: string[],
  options: { cwd?: string; timeout?: number } = {}
): Promise<ShellResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      shell: true,
      timeout: options.timeout ?? 30000,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 0,
      });
    });

    child.on('error', () => {
      resolve({
        stdout,
        stderr,
        exitCode: 1,
      });
    });
  });
}

/**
 * Check if a command exists
 */
export async function commandExists(command: string): Promise<boolean> {
  const checkCmd = process.platform === 'win32' ? 'where' : 'which';
  const result = await shell(checkCmd, [command]);
  return result.exitCode === 0;
}

/**
 * Get git user name
 */
export async function getGitUser(): Promise<{ name: string; email: string }> {
  const [nameResult, emailResult] = await Promise.all([
    shell('git', ['config', 'user.name']),
    shell('git', ['config', 'user.email']),
  ]);

  return {
    name: nameResult.stdout.trim() || '',
    email: emailResult.stdout.trim() || '',
  };
}

/**
 * Get current system username
 */
export async function getUsername(): Promise<string> {
  const result = await shell('whoami', []);
  return result.stdout.trim() || 'developer';
}

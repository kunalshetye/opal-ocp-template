/**
 * Dependencies step - skipped because OCP requires Yarn 1.x
 * 
 * Users must run `yarn install` manually to ensure they use the correct
 * package manager version required by Optimizely Connect Platform.
 */

import type { Context } from '../types.js';

export async function dependencies(
  ctx: Pick<Context, 'cwd' | 'packageManager' | 'install' | 'yes' | 'dryRun' | 'exit'>
): Promise<void> {
  // Skip dependency installation entirely
  // OCP requires Yarn 1.x, so users must run `yarn install` manually
  // This ensures they use the correct package manager version
  ctx.install = false;
}

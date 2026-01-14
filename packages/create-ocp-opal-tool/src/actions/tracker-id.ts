/**
 * Tracker ID step - collect OCP Tracker ID for deployment
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { Context } from '../types.js';
import { isValidTrackerId } from '../utils/validation.js';

export async function trackerId(
  ctx: Pick<Context, 'trackerId' | 'yes' | 'dryRun' | 'exit'>
): Promise<void> {
  // In yes mode, use placeholder
  if (ctx.yes) {
    ctx.trackerId = 'YOUR_TRACKER_ID';
    p.log.info(
      `${pc.dim('Tracker ID:')} Using placeholder - update later in app.yml`
    );
    return;
  }

  p.log.step(pc.cyan('OCP Deployment Configuration'));

  p.log.info(
    pc.dim(
      'Your Tracker ID is used to deploy the tool to your OCP account.\n' +
      '  You can find it in your OCP dashboard or leave blank for now.'
    )
  );

  const id = await p.text({
    message: 'OCP Tracker ID (optional, can set later)',
    placeholder: 'YOUR_TRACKER_ID',
    defaultValue: '',
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return undefined; // Optional field
      }
      if (!isValidTrackerId(value)) {
        return 'Tracker ID should only contain letters, numbers, hyphens, and underscores';
      }
      return undefined;
    },
  });

  if (p.isCancel(id)) {
    p.cancel('Operation cancelled.');
    ctx.exit(0);
  }

  ctx.trackerId = (id as string).trim() || 'YOUR_TRACKER_ID';

  if (ctx.dryRun) {
    p.log.info(`${pc.dim('[dry-run]')} Tracker ID: ${ctx.trackerId}`);
  }
}

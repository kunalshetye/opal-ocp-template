/**
 * Introduction step - displays welcome banner
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { Context } from '../types.js';

const PACKAGE_VERSION = '1.0.1';

export async function intro(
  ctx: Pick<Context, 'packageManager'>
): Promise<void> {
  // Clear some space
  console.log('');

  p.intro(
    `${pc.bgCyan(pc.black(' ocp-opal-wizard '))} ${pc.dim(`v${PACKAGE_VERSION}`)}`
  );

  p.log.info(
    `${pc.cyan('Welcome!')} Let's create your ${pc.bold('OCP Opal Tool')} project.`
  );
  p.log.info(
    pc.dim('Build tools hosted on Optimizely Connect Platform (OCP) that extend Opal\'s capabilities.')
  );
}

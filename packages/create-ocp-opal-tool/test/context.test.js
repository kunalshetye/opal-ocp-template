import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getContext } from '../dist/actions/context.js';

describe('context', () => {
  it('parses directory argument after create subcommand', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', 'my-project']);
    assert.equal(ctx.cwd, 'my-project');
  });

  it('sets default values', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create']);
    assert.equal(ctx.cwd, '');
    assert.equal(ctx.yes, false);
    assert.equal(ctx.dryRun, false);
    // packageManager depends on how tests are run (npm, yarn, etc.)
    assert.ok(['npm', 'yarn', 'pnpm', 'bun'].includes(ctx.packageManager));
  });

  it('parses --yes flag', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', '--yes']);
    assert.equal(ctx.yes, true);
  });

  it('parses -y shorthand', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', '-y']);
    assert.equal(ctx.yes, true);
  });

  it('parses --dry-run flag', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', '--dry-run']);
    assert.equal(ctx.dryRun, true);
  });

  it('parses --no-install flag', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', '--no-install']);
    assert.equal(ctx.install, false);
  });

  it('parses --no-git flag', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', '--no-git']);
    assert.equal(ctx.git, false);
  });

  it('parses --app-id option', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', '--app-id', 'my-app']);
    assert.equal(ctx.appId, 'my-app');
  });

  it('parses --tracker-id option', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', '--tracker-id', 'ABC123']);
    assert.equal(ctx.trackerId, 'ABC123');
  });

  it('parses --email option', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', '--email', 'test@example.com']);
    assert.equal(ctx.contactEmail, 'test@example.com');
  });

  it('parses multiple options together', async () => {
    const ctx = await getContext([
      'node', 'ocp-opal-wizard', 'create', 'my-project',
      '--yes', '--app-id', 'test-app', '--tracker-id', 'XYZ789'
    ]);
    assert.equal(ctx.cwd, 'my-project');
    assert.equal(ctx.yes, true);
    assert.equal(ctx.appId, 'test-app');
    assert.equal(ctx.trackerId, 'XYZ789');
  });

  it('handles --no flag correctly', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create', '--no']);
    assert.equal(ctx.yes, false);
    assert.equal(ctx.install, false);
    assert.equal(ctx.git, false);
  });

  it('provides exit function', async () => {
    const ctx = await getContext(['node', 'ocp-opal-wizard', 'create']);
    assert.equal(typeof ctx.exit, 'function');
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { projectName } from '../dist/actions/project-name.js';
import { createMockContext, createTempDir } from './utils.js';
import fs from 'node:fs';
import path from 'node:path';

describe('project name', () => {
  it('uses provided cwd if empty', async () => {
    const tmp = createTempDir();
    try {
      const ctx = createMockContext({ cwd: tmp.path });
      await projectName(ctx);
      assert.equal(ctx.cwd, tmp.path);
      assert.ok(ctx.projectName.length > 0);
    } finally {
      tmp.cleanup();
    }
  });

  it('extracts project name from path', async () => {
    const tmp = createTempDir();
    const projectDir = path.join(tmp.path, 'my-ocp-tool');
    try {
      const ctx = createMockContext({ cwd: projectDir });
      await projectName(ctx);
      assert.equal(ctx.projectName, 'my-ocp-tool');
    } finally {
      tmp.cleanup();
    }
  });

  it('generates name in yes mode with non-empty dir', async () => {
    const tmp = createTempDir();
    try {
      // Create a file to make it non-empty
      fs.writeFileSync(path.join(tmp.path, 'test.txt'), 'content');
      
      const ctx = createMockContext({ cwd: tmp.path, yes: true });
      await projectName(ctx);
      
      // Should generate a new project name
      assert.ok(ctx.projectName.startsWith('ocp-opal-'));
      assert.ok(ctx.cwd.startsWith('./'));
    } finally {
      tmp.cleanup();
    }
  });

  it('skips prompts in dry-run mode', async () => {
    const tmp = createTempDir();
    const projectDir = path.join(tmp.path, 'test-project');
    try {
      const ctx = createMockContext({ cwd: projectDir, dryRun: true });
      await projectName(ctx);
      assert.equal(ctx.projectName, 'test-project');
    } finally {
      tmp.cleanup();
    }
  });

  it('normalizes project name', async () => {
    const tmp = createTempDir();
    const projectDir = path.join(tmp.path, 'My Project Name');
    try {
      fs.mkdirSync(projectDir, { recursive: true });
      const ctx = createMockContext({ cwd: projectDir });
      await projectName(ctx);
      assert.equal(ctx.projectName, 'my-project-name');
    } finally {
      tmp.cleanup();
    }
  });
});

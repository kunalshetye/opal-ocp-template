import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import {
  detectPackageManager,
  getRunCommand,
  getInstallCommand,
  getExecCommand,
} from '../dist/utils/package-manager.js';

describe('package manager utilities', () => {
  let originalUserAgent;

  beforeEach(() => {
    originalUserAgent = process.env.npm_config_user_agent;
  });

  afterEach(() => {
    if (originalUserAgent !== undefined) {
      process.env.npm_config_user_agent = originalUserAgent;
    } else {
      delete process.env.npm_config_user_agent;
    }
  });

  describe('detectPackageManager', () => {
    it('returns npm when no user agent', () => {
      delete process.env.npm_config_user_agent;
      assert.equal(detectPackageManager(), 'npm');
    });

    it('detects npm', () => {
      process.env.npm_config_user_agent = 'npm/9.0.0 node/v18.0.0';
      assert.equal(detectPackageManager(), 'npm');
    });

    it('detects yarn', () => {
      process.env.npm_config_user_agent = 'yarn/1.22.0 node/v18.0.0';
      assert.equal(detectPackageManager(), 'yarn');
    });

    it('detects pnpm', () => {
      process.env.npm_config_user_agent = 'pnpm/8.0.0 node/v18.0.0';
      assert.equal(detectPackageManager(), 'pnpm');
    });

    it('detects bun', () => {
      process.env.npm_config_user_agent = 'bun/1.0.0 node/v18.0.0';
      assert.equal(detectPackageManager(), 'bun');
    });
  });

  describe('getRunCommand', () => {
    it('returns correct command for npm', () => {
      assert.equal(getRunCommand('npm'), 'npm run');
    });

    it('returns correct command for yarn', () => {
      assert.equal(getRunCommand('yarn'), 'yarn');
    });

    it('returns correct command for pnpm', () => {
      assert.equal(getRunCommand('pnpm'), 'pnpm');
    });

    it('returns correct command for bun', () => {
      assert.equal(getRunCommand('bun'), 'bun run');
    });
  });

  describe('getInstallCommand', () => {
    it('returns correct command for npm', () => {
      assert.equal(getInstallCommand('npm'), 'npm install');
    });

    it('returns correct command for yarn', () => {
      assert.equal(getInstallCommand('yarn'), 'yarn');
    });

    it('returns correct command for pnpm', () => {
      assert.equal(getInstallCommand('pnpm'), 'pnpm install');
    });

    it('returns correct command for bun', () => {
      assert.equal(getInstallCommand('bun'), 'bun install');
    });
  });

  describe('getExecCommand', () => {
    it('returns correct command for npm', () => {
      assert.equal(getExecCommand('npm'), 'npx');
    });

    it('returns correct command for yarn', () => {
      assert.equal(getExecCommand('yarn'), 'yarn dlx');
    });

    it('returns correct command for pnpm', () => {
      assert.equal(getExecCommand('pnpm'), 'pnpm dlx');
    });

    it('returns correct command for bun', () => {
      assert.equal(getExecCommand('bun'), 'bunx');
    });
  });
});

import { before, beforeEach, afterEach } from 'node:test';
import { stripVTControlCharacters } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

/**
 * Test utilities for mocking stdout and managing test fixtures
 */

/**
 * Create a mock stdout that captures messages
 */
export function createMockStdout() {
  const ctx = { messages: [] };

  const mockStdout = {
    write(buf) {
      ctx.messages.push(stripVTControlCharacters(String(buf)).trim());
      return true;
    },
    columns: 120,
    isTTY: true,
  };

  return {
    stdout: mockStdout,
    messages: () => ctx.messages,
    clear: () => { ctx.messages = []; },
    hasMessage: (content) => ctx.messages.some((msg) => msg.includes(content)),
    getMessages: () => ctx.messages.join('\n'),
  };
}

/**
 * Create a temporary directory for test fixtures
 */
export function createTempDir() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-ocp-opal-tool-test-'));
  return {
    path: tmpDir,
    cleanup: () => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    },
  };
}

/**
 * Create a mock prompt function that returns predefined answers
 */
export function createMockPrompt(answers) {
  let callIndex = 0;
  return async (options) => {
    const answer = answers[callIndex] ?? answers[options.name] ?? options.defaultValue;
    callIndex++;
    return answer;
  };
}

/**
 * Create a mock context for testing
 */
export function createMockContext(overrides = {}) {
  return {
    help: false,
    cwd: '',
    packageManager: 'npm',
    projectName: '',
    yes: false,
    dryRun: false,
    install: undefined,
    git: undefined,
    appId: '',
    appDisplayName: '',
    appDescription: '',
    appSummary: '',
    trackerId: '',
    githubUsername: '',
    repoName: '',
    contactEmail: '',
    toolDescription: '',
    exit: (code) => { throw new Error(`Exit called with code ${code}`); },
    ...overrides,
  };
}

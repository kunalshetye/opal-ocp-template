import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isEmpty,
  toValidAppId,
  toDisplayName,
  isValidTrackerId,
  isValidEmail,
  isValidGithubUsername,
  hasNonPrintableChars,
} from '../dist/utils/validation.js';
import { createTempDir } from './utils.js';
import fs from 'node:fs';
import path from 'node:path';

describe('validation utilities', () => {
  describe('isEmpty', () => {
    it('returns true for non-existent directory', () => {
      assert.equal(isEmpty('/path/that/does/not/exist'), true);
    });

    it('returns true for empty directory', () => {
      const tmp = createTempDir();
      try {
        assert.equal(isEmpty(tmp.path), true);
      } finally {
        tmp.cleanup();
      }
    });

    it('returns false for directory with files', () => {
      const tmp = createTempDir();
      try {
        fs.writeFileSync(path.join(tmp.path, 'test.txt'), 'content');
        assert.equal(isEmpty(tmp.path), false);
      } finally {
        tmp.cleanup();
      }
    });

    it('ignores .git and .DS_Store', () => {
      const tmp = createTempDir();
      try {
        fs.mkdirSync(path.join(tmp.path, '.git'));
        fs.writeFileSync(path.join(tmp.path, '.DS_Store'), '');
        assert.equal(isEmpty(tmp.path), true);
      } finally {
        tmp.cleanup();
      }
    });
  });

  describe('toValidAppId', () => {
    it('converts to lowercase', () => {
      assert.equal(toValidAppId('MyApp'), 'myapp');
    });

    it('replaces spaces with hyphens', () => {
      assert.equal(toValidAppId('My App Name'), 'my-app-name');
    });

    it('removes invalid characters', () => {
      assert.equal(toValidAppId('my@app!name'), 'myappname');
    });

    it('removes leading and trailing hyphens', () => {
      assert.equal(toValidAppId('-my-app-'), 'my-app');
    });

    it('trims whitespace', () => {
      assert.equal(toValidAppId('  my-app  '), 'my-app');
    });

    it('handles empty string', () => {
      assert.equal(toValidAppId(''), '');
    });

    it('handles complex names', () => {
      assert.equal(toValidAppId('My Awesome OCP Tool!'), 'my-awesome-ocp-tool');
    });
  });

  describe('toDisplayName', () => {
    it('capitalizes words', () => {
      assert.equal(toDisplayName('my-app'), 'My App');
    });

    it('handles single word', () => {
      assert.equal(toDisplayName('app'), 'App');
    });

    it('handles multiple hyphens', () => {
      assert.equal(toDisplayName('my-awesome-ocp-tool'), 'My Awesome Ocp Tool');
    });
  });

  describe('isValidTrackerId', () => {
    it('accepts alphanumeric IDs', () => {
      assert.equal(isValidTrackerId('ABC123'), true);
    });

    it('accepts IDs with hyphens and underscores', () => {
      assert.equal(isValidTrackerId('my-tracker_id'), true);
    });

    it('rejects empty string', () => {
      assert.equal(isValidTrackerId(''), false);
    });

    it('rejects whitespace only', () => {
      assert.equal(isValidTrackerId('   '), false);
    });

    it('rejects special characters', () => {
      assert.equal(isValidTrackerId('tracker@id'), false);
    });
  });

  describe('isValidEmail', () => {
    it('accepts valid email', () => {
      assert.equal(isValidEmail('test@example.com'), true);
    });

    it('accepts email with subdomain', () => {
      assert.equal(isValidEmail('test@mail.example.com'), true);
    });

    it('rejects empty string', () => {
      assert.equal(isValidEmail(''), false);
    });

    it('rejects email without @', () => {
      assert.equal(isValidEmail('testexample.com'), false);
    });

    it('rejects email without domain', () => {
      assert.equal(isValidEmail('test@'), false);
    });
  });

  describe('isValidGithubUsername', () => {
    it('accepts valid username', () => {
      assert.equal(isValidGithubUsername('octocat'), true);
    });

    it('accepts username with hyphens', () => {
      assert.equal(isValidGithubUsername('octo-cat'), true);
    });

    it('accepts username with numbers', () => {
      assert.equal(isValidGithubUsername('octocat123'), true);
    });

    it('rejects empty string', () => {
      assert.equal(isValidGithubUsername(''), false);
    });

    it('rejects username starting with hyphen', () => {
      assert.equal(isValidGithubUsername('-octocat'), false);
    });

    it('rejects username with special characters', () => {
      assert.equal(isValidGithubUsername('octo@cat'), false);
    });
  });

  describe('hasNonPrintableChars', () => {
    it('returns false for printable string', () => {
      assert.equal(hasNonPrintableChars('Hello World!'), false);
    });

    it('returns true for string with tab', () => {
      assert.equal(hasNonPrintableChars('Hello\tWorld'), true);
    });

    it('returns true for string with newline', () => {
      assert.equal(hasNonPrintableChars('Hello\nWorld'), true);
    });
  });
});

/**
 * Validation utilities for user inputs
 */

/**
 * Check if a directory is empty (or doesn't exist)
 */
import fs from 'node:fs';
import path from 'node:path';

export function isEmpty(dirPath: string): boolean {
  try {
    const resolvedPath = path.resolve(dirPath);
    if (!fs.existsSync(resolvedPath)) {
      return true;
    }
    const files = fs.readdirSync(resolvedPath);
    // Ignore .git and .DS_Store
    const significantFiles = files.filter(
      (f) => f !== '.git' && f !== '.DS_Store' && f !== '.gitkeep'
    );
    return significantFiles.length === 0;
  } catch {
    return true;
  }
}

/**
 * Convert a string to a valid npm package name / app ID
 * - lowercase
 * - replace spaces with hyphens
 * - remove invalid characters
 * - remove leading/trailing hyphens
 */
export function toValidAppId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '')
    .substring(0, 214); // npm package name limit
}

/**
 * Convert app ID to display name
 * - capitalize first letter of each word
 * - replace hyphens with spaces
 */
export function toDisplayName(appId: string): string {
  return appId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate OCP Tracker ID format
 * Tracker IDs are typically alphanumeric strings
 */
export function isValidTrackerId(trackerId: string): boolean {
  if (!trackerId || trackerId.trim().length === 0) {
    return false;
  }
  // Tracker IDs are typically alphanumeric, may contain underscores
  return /^[a-zA-Z0-9_-]+$/.test(trackerId.trim());
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.trim().length === 0) {
    return false;
  }
  // Basic email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validate GitHub username format
 */
export function isValidGithubUsername(username: string): boolean {
  if (!username || username.trim().length === 0) {
    return false;
  }
  // GitHub usernames: alphanumeric, hyphens, no consecutive hyphens, 1-39 chars
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username.trim());
}

/**
 * Check for non-printable characters
 */
export function hasNonPrintableChars(str: string): boolean {
  return /[^\x20-\x7E]/.test(str);
}

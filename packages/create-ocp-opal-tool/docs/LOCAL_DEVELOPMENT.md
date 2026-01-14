# Local Development Guide

This guide explains how to develop, test, and debug the `@kunalshetye/ocp-opal-wizard` CLI locally before publishing to npm.

## Prerequisites

- Node.js 18+ installed
- Yarn or npm
- Git

## Project Structure

```
packages/create-ocp-opal-tool/
├── bin/
│   └── ocp-opal-wizard.mjs     # CLI entry point
├── src/
│   ├── index.ts                # Main entry, subcommand routing
│   ├── types.ts                # TypeScript type definitions
│   ├── actions/                # Wizard steps
│   │   ├── context.ts          # CLI argument parsing
│   │   ├── intro.ts            # Welcome banner
│   │   ├── project-name.ts     # Project directory prompt
│   │   ├── app-details.ts      # App configuration prompts
│   │   ├── tracker-id.ts       # OCP tracker ID prompt
│   │   ├── scaffold.ts         # File generation
│   │   ├── dependencies.ts     # Dependency installation
│   │   ├── git.ts              # Git initialization
│   │   ├── next-steps.ts       # Success message
│   │   └── help.ts             # Help text
│   └── utils/
│       ├── validation.ts       # Input validation
│       ├── package-manager.ts  # Package manager detection
│       └── shell.ts            # Shell command utilities
├── template/                   # Template files (with {{PLACEHOLDERS}})
├── test/                       # Test files
├── dist/                       # Compiled output (generated)
└── docs/
    └── LOCAL_DEVELOPMENT.md    # This file
```

## Getting Started

### 1. Install Dependencies

```bash
cd packages/create-ocp-opal-tool
yarn install
```

### 2. Build the CLI

```bash
yarn build
```

This compiles TypeScript from `src/` to `dist/`.

### 3. Verify the Build

```bash
ls dist/
# Should see: index.js, index.d.ts, actions/, utils/, types.js, etc.
```

## Testing Locally

### Method 1: Run Directly from bin/ (Recommended)

The simplest way to test - run the bin file directly:

```bash
# Show help
node bin/ocp-opal-wizard.mjs --help

# Show create subcommand help
node bin/ocp-opal-wizard.mjs create --help

# Dry run - see what would be created without actually creating files
node bin/ocp-opal-wizard.mjs create my-test-project --yes --dry-run

# Interactive mode
node bin/ocp-opal-wizard.mjs create

# Create in a specific directory with defaults
node bin/ocp-opal-wizard.mjs create my-test-project --yes
```

### Method 2: Use npm link (Global Installation)

Link the package globally to test as if it were installed from npm:

```bash
# From the CLI package directory
cd packages/create-ocp-opal-tool

# Create global symlink
npm link

# Now you can run from anywhere
ocp-opal-wizard --help
ocp-opal-wizard create my-project --dry-run

# When done, unlink
npm unlink -g @kunalshetye/ocp-opal-wizard
```

### Method 3: Use npx with Local Path

```bash
# From repo root
npx ./packages/create-ocp-opal-tool create my-project --dry-run
```

### Method 4: Pack and Install Locally

Test the actual npm package that would be published:

```bash
cd packages/create-ocp-opal-tool

# Create a tarball
npm pack

# This creates: kunalshetye-ocp-opal-wizard-1.0.0.tgz

# Install it globally from the tarball
npm install -g kunalshetye-ocp-opal-wizard-1.0.0.tgz

# Test it
ocp-opal-wizard create test-project --dry-run

# Cleanup
npm uninstall -g @kunalshetye/ocp-opal-wizard
rm kunalshetye-ocp-opal-wizard-1.0.0.tgz
```

## Testing Scenarios

### Quick Validation (Dry Run)

```bash
# Fast check that CLI parses args and runs through wizard
node bin/ocp-opal-wizard.mjs create test-app --yes --dry-run
```

### Full Project Creation

```bash
# Create a real project in a temp directory
mkdir /tmp/wizard-test && cd /tmp/wizard-test
node /path/to/packages/create-ocp-opal-tool/bin/ocp-opal-wizard.mjs create my-tool --yes

# Verify the project
ls -la my-tool/
cat my-tool/package.json
cat my-tool/app.yml

# Try building the generated project
cd my-tool
yarn install
yarn build
yarn validate

# Cleanup
cd .. && rm -rf /tmp/wizard-test
```

### Test Specific Options

```bash
# Test with all CLI options
node bin/ocp-opal-wizard.mjs create my-tool \
  --app-id my-custom-app \
  --display-name "My Custom App" \
  --description "A custom OCP Opal Tool" \
  --tracker-id ABC123XYZ \
  --email dev@example.com \
  --github-user myusername \
  --no-git \
  --no-install \
  --dry-run
```

### Test Error Handling

```bash
# Invalid directory name
node bin/ocp-opal-wizard.mjs create "invalid name with spaces" --yes --dry-run

# Missing subcommand
node bin/ocp-opal-wizard.mjs

# Unknown option
node bin/ocp-opal-wizard.mjs create --unknown-option
```

## Running Tests

The project uses Node.js built-in test runner:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run a specific test file
node --test test/validation.test.js
node --test test/context.test.js
```

## Development Workflow

### Making Changes

1. Edit source files in `src/`
2. Rebuild: `yarn build`
3. Test: `node bin/ocp-opal-wizard.mjs create test --yes --dry-run`
4. Run tests: `yarn test`

### Watch Mode

For rapid iteration, use two terminals:

**Terminal 1 - TypeScript compiler in watch mode:**
```bash
yarn dev
```

**Terminal 2 - Test your changes:**
```bash
node bin/ocp-opal-wizard.mjs create test --yes --dry-run
```

## Debugging

### Add Console Logs

Temporarily add `console.log()` statements in `src/` files, rebuild, and run.

### Node.js Debugger

```bash
# Run with debugger
node --inspect-brk bin/ocp-opal-wizard.mjs create test --dry-run

# Then open chrome://inspect in Chrome
```

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI",
      "program": "${workspaceFolder}/packages/create-ocp-opal-tool/bin/ocp-opal-wizard.mjs",
      "args": ["create", "test-project", "--yes", "--dry-run"],
      "cwd": "${workspaceFolder}/packages/create-ocp-opal-tool",
      "console": "integratedTerminal"
    }
  ]
}
```

## Template Files

Template files in `template/` use `{{PLACEHOLDER}}` tokens that get replaced during scaffolding:

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `{{APP_ID}}` | OCP App ID | `my-opal-tool` |
| `{{APP_DISPLAY_NAME}}` | Display name | `My Opal Tool` |
| `{{APP_DESCRIPTION}}` | Description | `An OCP Opal Tool` |
| `{{APP_SUMMARY}}` | Short summary | `Extends Opal capabilities` |
| `{{TRACKER_ID}}` | OCP Tracker ID | `ABC123` |
| `{{GITHUB_USERNAME}}` | GitHub username | `kunalshetye` |
| `{{REPO_NAME}}` | Repository name | `my-opal-tool` |
| `{{CONTACT_EMAIL}}` | Contact email | `dev@example.com` |
| `{{TOOL_DESCRIPTION}}` | Tool description | `A custom tool for Opal` |

### Testing Template Changes

1. Edit files in `template/`
2. Run a dry-run to see token replacements:
   ```bash
   node bin/ocp-opal-wizard.mjs create test --yes --dry-run
   ```
3. Or create a real project and inspect the output:
   ```bash
   node bin/ocp-opal-wizard.mjs create /tmp/test-output --yes --no-install --no-git
   cat /tmp/test-output/app.yml
   ```

## Pre-Publish Checklist

Before publishing to npm:

- [ ] All tests pass: `yarn test`
- [ ] Build succeeds: `yarn build`
- [ ] Dry-run works: `node bin/ocp-opal-wizard.mjs create test --yes --dry-run`
- [ ] Full creation works: Test in temp directory
- [ ] Generated project builds: `cd generated-project && yarn build && yarn validate`
- [ ] Version updated in `package.json`
- [ ] README is up to date
- [ ] CHANGELOG updated (if exists)

## Publishing

```bash
# Ensure you're logged in to npm
npm whoami

# Dry-run publish to see what would be published
npm publish --dry-run

# Publish (scoped packages are private by default)
npm publish --access public
```

## Troubleshooting

### "Command not found" after npm link

Make sure npm's global bin directory is in your PATH:
```bash
npm bin -g
# Add this to your PATH if not present
```

### Changes not reflected after editing

Rebuild after any source changes:
```bash
yarn build
```

### Tests failing after refactor

The tests in `test/` may reference old function signatures. Update them to match the new code.

### Template files not being copied

Ensure `template/` is listed in `files` array in `package.json`.

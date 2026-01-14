# AGENTS.md

This file provides guidance for AI coding agents working with this repository.

## Repository Overview

This repository contains `@kunalshetye/ocp-opal-wizard`, a CLI wizard for scaffolding Optimizely Connect Platform (OCP) Opal Tool projects.

## Repository Structure

```
opal-ocp-template/
├── packages/
│   └── create-ocp-opal-tool/       # The CLI wizard package
│       ├── src/                    # CLI source code (TypeScript ESM)
│       ├── template/               # Template files for scaffolding
│       ├── test/                   # Tests (68 tests, Node test runner)
│       ├── docs/                   # Development documentation
│       ├── bin/                    # CLI entry point
│       └── package.json            # @kunalshetye/ocp-opal-wizard
├── AGENTS.md                       # This file (repo-level AI guidance)
├── CLAUDE.md                       # Quick reference for AI assistants
└── README.md                       # Repository documentation
```

## CLI Package (`packages/create-ocp-opal-tool`)

### Development Commands

```bash
cd packages/create-ocp-opal-tool

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run all tests (68 tests)
npm test

# Run tests in watch mode
npm run test:watch

# Test the CLI locally
node bin/ocp-opal-wizard.mjs --help
node bin/ocp-opal-wizard.mjs create --help
node bin/ocp-opal-wizard.mjs create my-project --yes --dry-run
```

### Publishing

```bash
cd packages/create-ocp-opal-tool

# Login to npm
npm login

# Publish (scoped packages need --access public)
npm publish --access public
```

### CLI Usage (after npm publish)

```bash
npx @kunalshetye/ocp-opal-wizard create my-app
cd my-app
yarn install
yarn build
```

## Template Files

The `packages/create-ocp-opal-tool/template/` directory contains the files that get scaffolded when users run the wizard. These include:

- `app.yml` - OCP app manifest
- `package.json` - Project dependencies
- `tsconfig.json` - TypeScript configuration
- `src/` - Source code with example tool
- `forms/settings.yml` - Settings form
- `assets/` - Icons and directory overview
- `AGENTS.md` - AI guidance for scaffolded projects
- `CLAUDE.md` - AI quick reference for scaffolded projects
- `README.md` - Project documentation

Template files use `{{PLACEHOLDER}}` tokens that get replaced during scaffolding:
- `{{APP_ID}}` - App identifier
- `{{APP_DISPLAY_NAME}}` - Human-readable name
- `{{APP_DESCRIPTION}}` - Description
- `{{TRACKER_ID}}` - OCP tracker ID
- etc.

## Code Style

### TypeScript

- Use ESM modules (`"type": "module"` in package.json)
- Explicit return types on functions
- Use `@clack/prompts` for CLI UI
- Use `yargs` for argument parsing
- Use `picocolors` for terminal colors

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `project-name.ts` |
| Functions | camelCase | `getContext` |
| Types | PascalCase | `Context`, `TemplateTokens` |
| Constants | UPPER_SNAKE_CASE | `TEMPLATE_FILES` |

### Testing

Tests use Node.js built-in test runner:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('feature', () => {
  it('should do something', () => {
    assert.equal(actual, expected);
  });
});
```

## OCP Requirements (for scaffolded projects)

When modifying template files, ensure they meet OCP requirements:

1. **Yarn 1.x (Classic)** - OCP requires Yarn Classic, not Yarn 4.x
2. **Node 22+** - Required by `@optimizely-opal/opal-tool-ocp-sdk`
3. **Required scripts** - `lint` and `test` scripts must exist (even as placeholders)
4. **grpc-boom resolution** - Must include `"grpc-boom": "3.0.11"` in resolutions

### forms/settings.yml Syntax

| Wrong | Correct |
|-------|---------|
| `helpText:` | `help:` |
| `label:` (in options) | `text:` |
| `meta:` at root | Remove it |

## Common Tasks

### Add a New Template File

1. Create the file in `packages/create-ocp-opal-tool/template/`
2. Add the file path to `TEMPLATE_FILES` array in `src/actions/scaffold.ts`
3. Use `{{PLACEHOLDER}}` tokens for dynamic values
4. Rebuild and test

### Modify CLI Behavior

1. Edit files in `packages/create-ocp-opal-tool/src/`
2. Key files:
   - `index.ts` - Main entry, command routing
   - `actions/context.ts` - Argument parsing
   - `actions/scaffold.ts` - File generation
   - `actions/next-steps.ts` - Success message
3. Rebuild: `npm run build`
4. Test: `node bin/ocp-opal-wizard.mjs create test --yes --dry-run`
5. Run tests: `npm test`

### Update Version

1. Update version in `packages/create-ocp-opal-tool/package.json`
2. Update version in `src/actions/intro.ts` and `src/actions/context.ts`
3. Rebuild and publish

## Links

- [OCP Documentation](https://docs.developers.optimizely.com/optimizely-connect-platform/docs)
- [Opal Tool SDK](https://www.npmjs.com/package/@optimizely-opal/opal-tool-ocp-sdk)
- [npm Package](https://www.npmjs.com/package/@kunalshetye/ocp-opal-wizard)

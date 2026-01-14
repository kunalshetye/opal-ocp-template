# CLAUDE.md

Quick reference for AI assistants working with the OCP Opal Wizard repository.

## What Is This Repo?

This repo contains `@kunalshetye/ocp-opal-wizard` - a CLI wizard that scaffolds OCP Opal Tool projects.

**This is NOT a template to clone.** Users run:
```bash
npx @kunalshetye/ocp-opal-wizard create my-app
```

## Quick Commands

```bash
cd packages/create-ocp-opal-tool

# Install & build
npm install
npm run build

# Run tests (68 tests)
npm test

# Test CLI locally
node bin/ocp-opal-wizard.mjs --help
node bin/ocp-opal-wizard.mjs create my-project --yes --dry-run

# Publish to npm
npm login
npm publish --access public
```

## Key Files

| File | Purpose |
|------|---------|
| `packages/create-ocp-opal-tool/src/index.ts` | Main entry, yargs commands |
| `packages/create-ocp-opal-tool/src/actions/scaffold.ts` | Copies template files |
| `packages/create-ocp-opal-tool/src/actions/context.ts` | CLI argument parsing |
| `packages/create-ocp-opal-tool/template/` | Files that get scaffolded |

## Template Token Replacement

Files in `template/` use `{{PLACEHOLDER}}` tokens:

```
{{APP_ID}}           → my-app
{{APP_DISPLAY_NAME}} → My App
{{APP_DESCRIPTION}}  → An OCP Opal Tool
{{TRACKER_ID}}       → ABC123
{{GITHUB_USERNAME}}  → kunalshetye
{{CONTACT_EMAIL}}    → email@example.com
```

## Adding a Template File

1. Create file in `packages/create-ocp-opal-tool/template/`
2. Add path to `TEMPLATE_FILES` in `src/actions/scaffold.ts`
3. Use `{{PLACEHOLDER}}` tokens as needed
4. `npm run build && npm test`

## OCP Requirements

Scaffolded projects must have:

```json
{
  "scripts": {
    "lint": "echo 'No linter configured'",
    "test": "echo 'No tests configured'"
  },
  "resolutions": {
    "grpc-boom": "3.0.11"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

## forms/settings.yml Gotchas

| Wrong | Correct |
|-------|---------|
| `helpText:` | `help:` |
| `label:` (in options) | `text:` |
| `meta:` at root | Remove it |

## Repo Structure

```
opal-ocp-template/
├── packages/
│   └── create-ocp-opal-tool/    # The npm package
│       ├── src/                 # CLI TypeScript source
│       ├── template/            # Files to scaffold
│       ├── test/                # 68 tests
│       ├── docs/                # LOCAL_DEVELOPMENT.md
│       └── bin/                 # Entry point
├── AGENTS.md                    # Detailed AI guidance
├── CLAUDE.md                    # This file
└── README.md                    # Repo docs
```

## Don't Forget

- OCP requires **Yarn 1.x** (Classic), not Yarn 4.x
- Scaffolded projects tell users to run `yarn install`, not `npm install`
- Version is in 3 places: `package.json`, `intro.ts`, `context.ts`

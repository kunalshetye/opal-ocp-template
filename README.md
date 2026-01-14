# OCP Opal Wizard

A CLI wizard to scaffold **Optimizely Connect Platform (OCP) Opal Tools**.

## Quick Start

```bash
npx @kunalshetye/ocp-opal-wizard create my-app
cd my-app
yarn install
yarn build
```

> **Important:** Always use `npx` to run the wizard (not `yarn create`). The wizard runs via npm/npx, but the scaffolded project uses Yarn 1.x as required by OCP. This works regardless of which Yarn version you have installed globally.

## What is an OCP Opal Tool?

OCP Opal Tools are applications hosted on Optimizely Connect Platform (OCP) that extend the capabilities of Opal, Optimizely's AI assistant. These tools allow Opal to perform custom actions and integrations.

## Prerequisites

### 1. OCP Developer Account

You need an OCP developer account. Contact Optimizely to get access.

### 2. Install OCP CLI

```bash
# Create credentials file with your API key (from OCP developer invitation email)
mkdir -p ~/.ocp
echo '{"apiKey": "<YOUR_API_KEY>"}' > ~/.ocp/credentials.json

# Install OCP CLI globally (requires Yarn 1.x)
yarn global add @optimizely/ocp-cli

# Add to PATH
export PATH="$(yarn global bin):$PATH"

# Verify installation
ocp accounts whoami
```

> **Note:** OCP requires Yarn 1.x (Classic). See the [Yarn Classic installation guide](https://classic.yarnpkg.com/lang/en/docs/install).

For detailed setup, see [Configure your OCP development environment](https://docs.developers.optimizely.com/optimizely-connect-platform/docs/configure-your-development-environment-ocp2).

## Usage

### Interactive Mode (Recommended)

```bash
npx @kunalshetye/ocp-opal-wizard create
```

### With Project Name

```bash
npx @kunalshetye/ocp-opal-wizard create my-opal-tool
```

### Quick Setup with Defaults

```bash
npx @kunalshetye/ocp-opal-wizard create my-opal-tool --yes
```

### Dry Run (Preview)

```bash
npx @kunalshetye/ocp-opal-wizard create my-opal-tool --yes --dry-run
```

## What Gets Created

```
my-opal-tool/
├── src/
│   ├── index.ts                    # Entry point
│   ├── functions/
│   │   └── OpalToolFunction.ts     # Tool implementations
│   └── lifecycle/
│       └── Lifecycle.ts            # OCP lifecycle hooks
├── forms/
│   └── settings.yml                # Settings form
├── assets/
│   ├── icon.svg                    # App icon
│   ├── logo.svg                    # App logo
│   └── directory/
│       └── overview.md             # App Directory description
├── app.yml                         # OCP manifest
├── package.json
├── tsconfig.json
├── AGENTS.md                       # AI assistant guidance
├── CLAUDE.md                       # AI assistant quick reference
└── README.md
```

## After Scaffolding

```bash
cd my-opal-tool

# Install dependencies (OCP requires Yarn 1.x)
yarn install

# Build the project
yarn build

# Validate configuration
yarn validate

# Deploy to OCP
ocp app register
ocp app prepare
ocp directory install <APP_ID>@<VERSION> <TRACKER_ID>
```

## CLI Options

```bash
ocp-opal-wizard create [directory] [options]

Arguments:
  [directory]          Project directory (default: interactive prompt)

Options:
  -y, --yes            Skip prompts, use defaults
  --no-git             Skip git initialization
  --dry-run            Show what would be done without making changes

  --app-id             OCP App ID
  --display-name       App display name
  --description        App description
  --tracker-id         OCP Tracker ID for deployment
  --email              Contact email

  -h, --help           Show help message
  -v, --version        Show version number
```

## Repository Structure

```
opal-ocp-template/
├── packages/
│   └── create-ocp-opal-tool/       # The CLI wizard (@kunalshetye/ocp-opal-wizard)
│       ├── src/                    # CLI source code
│       ├── template/               # Template files for scaffolding
│       ├── test/                   # Tests (68 tests)
│       ├── docs/                   # Development documentation
│       └── bin/                    # CLI entry point
├── AGENTS.md                       # AI guidance for repo contributors
├── CLAUDE.md                       # AI quick reference for repo
└── README.md                       # This file
```

## Development

To contribute to the wizard itself:

```bash
# Clone the repo
git clone https://github.com/kunalshetye/opal-ocp-template.git
cd opal-ocp-template/packages/create-ocp-opal-tool

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Test locally
node bin/ocp-opal-wizard.mjs create test-project --yes --dry-run
```

See [packages/create-ocp-opal-tool/docs/LOCAL_DEVELOPMENT.md](packages/create-ocp-opal-tool/docs/LOCAL_DEVELOPMENT.md) for detailed development instructions.

## Learn More

- [OCP Documentation](https://docs.developers.optimizely.com/optimizely-connect-platform/docs)
- [Configure OCP Development Environment](https://docs.developers.optimizely.com/optimizely-connect-platform/docs/configure-your-development-environment-ocp2)
- [Opal Tool SDK](https://www.npmjs.com/package/@optimizely-opal/opal-tool-ocp-sdk)

## License

MIT

## Author

[Kunal Shetye](https://github.com/kunalshetye)

---

**Note:** This is a community project and is not officially supported by Optimizely.

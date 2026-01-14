# @kunalshetye/ocp-opal-wizard

CLI wizard to scaffold **Optimizely Connect Platform (OCP) Opal Tools**.

## Prerequisites

### Install OCP CLI

Before using this wizard, you need the OCP CLI installed:

```bash
# 1. Create credentials file with your API key (from OCP developer invitation email)
mkdir -p ~/.ocp
echo '{"apiKey": "<YOUR_API_KEY>"}' > ~/.ocp/credentials.json

# 2. Install OCP CLI globally (requires Yarn 1.x)
yarn global add @optimizely/ocp-cli

# 3. Add to PATH
export PATH="$(yarn global bin):$PATH"

# 4. Verify installation
ocp accounts whoami
```

> **Note:** OCP requires Yarn 1.x (Classic). See the [Yarn Classic installation guide](https://classic.yarnpkg.com/lang/en/docs/install).

For detailed setup instructions, see [Configure your OCP development environment](https://docs.developers.optimizely.com/optimizely-connect-platform/docs/configure-your-development-environment-ocp2).

## Usage

```bash
npx @kunalshetye/ocp-opal-wizard create my-app
cd my-app
yarn install
yarn build
```

> **Important:** Always use `npx` to run the wizard (not `yarn create`). The wizard runs via npm/npx, but the scaffolded project uses Yarn 1.x as required by OCP. This works regardless of which Yarn version you have installed globally.

## Interactive Wizard

The CLI guides you through setting up your OCP Opal Tool project:

1. **Project directory** - Where to create the project
2. **App configuration** - App ID, display name, description
3. **Tracker ID** - OCP deployment target (optional)
4. **Repository info** - GitHub username, contact email
5. **Git initialization** - Optional git setup

## Command Line Options

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

## Examples

### Interactive Mode (Recommended)

```bash
npx @kunalshetye/ocp-opal-wizard create
```

### Quick Setup with Defaults

```bash
npx @kunalshetye/ocp-opal-wizard create my-tool --yes
```

### Specify Options

```bash
npx @kunalshetye/ocp-opal-wizard create my-tool \
  --app-id my-opal-tool \
  --tracker-id ABC123 \
  --email dev@example.com
```

### Dry Run (Preview)

```bash
npx @kunalshetye/ocp-opal-wizard create my-tool --yes --dry-run
```

## What Gets Created

```
my-tool/
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
├── .gitignore
└── README.md
```

## After Scaffolding

```bash
cd my-tool

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

## OCP CLI Commands Reference

| Command | Description |
|---------|-------------|
| `ocp app register` | Register your app with OCP |
| `ocp app prepare` | Validate, package, upload and build |
| `ocp app validate` | Validate app locally |
| `ocp app logs` | Fetch app logs |
| `ocp directory publish <APP_ID>@<VERSION>` | Publish app version |
| `ocp directory install <APP_ID>@<VERSION> <TRACKER_ID>` | Install to account |
| `ocp directory uninstall <APP_ID> <TRACKER_ID>` | Uninstall from account |
| `ocp accounts whoami` | Show your account info |
| `ocp accounts whois <USER>` | Show user info |

For full CLI documentation, run `ocp -h` or see the [OCP CLI docs](https://docs.developers.optimizely.com/optimizely-connect-platform/docs/configure-your-development-environment-ocp2#ocp-cli-commands).

## Development

```bash
# Install dependencies
yarn install

# Build
yarn build

# Run tests
yarn test

# Watch mode
yarn dev
```

## Learn More

- [OCP Documentation](https://docs.developers.optimizely.com/optimizely-connect-platform/docs)
- [Configure OCP Development Environment](https://docs.developers.optimizely.com/optimizely-connect-platform/docs/configure-your-development-environment-ocp2)
- [Opal Tool SDK](https://www.npmjs.com/package/@optimizely-opal/opal-tool-ocp-sdk)
- [Template Repository](https://github.com/kunalshetye/opal-ocp-template)

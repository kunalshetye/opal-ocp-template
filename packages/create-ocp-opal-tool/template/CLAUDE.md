# CLAUDE.md

Instructions for Claude (and other AI assistants) working with this OCP Opal Tool project.

## Quick Reference

### Build & Deploy Commands

```bash
# 1. Install dependencies (must use Yarn 1.x)
yarn install

# 2. Build the project
yarn build

# 3. Validate (build + OCP validation)
yarn validate

# 4. Prepare for publishing
ocp app prepare

# 5. Publish to App Directory
ocp directory publish {{APP_ID}}@VERSION

# 6. Install to OCP account
ocp directory install {{APP_ID}}@VERSION TRACKER_ID
```

### Get Tracker ID

```bash
ocp accounts whoami                    # List accounts
ocp accounts whois ACCOUNT_NAME        # Get tracker ID
ocp accounts whois ACCOUNT_NAME -a=eu  # For EU shard
```

## Critical Requirements

### OCP Requires Yarn 1.x (Classic)

**Always use Yarn Classic, not Yarn 4.x or npm:**
```bash
yarn install   # Correct
npm install    # Will cause issues with OCP
```

### package.json Must Have

```json
{
  "scripts": {
    "build": "yarn clean && yarn compile && yarn copy-config",
    "lint": "echo 'No linter configured'",
    "test": "echo 'No tests configured'"
  },
  "engines": {
    "node": ">=22.0.0"
  },
  "resolutions": {
    "grpc-boom": "3.0.11"
  }
}
```

**Why these matter:**
- `lint` and `test` scripts are required by OCP build, even if empty
- `grpc-boom` resolution prevents cryptic yarn registry errors
- Node 22+ is required by `@optimizely-opal/opal-tool-ocp-sdk`

### forms/settings.yml Syntax

**Correct:**
```yaml
sections:
  - key: general
    label: General Settings
    elements:
      - key: my_field
        label: My Field
        type: select
        help: Description here        # NOT 'helpText'
        options:
          - value: option1
            text: Option 1            # NOT 'label'
```

**Common Mistakes:**
| Wrong | Correct |
|-------|---------|
| `helpText:` | `help:` |
| `label:` (in options) | `text:` |
| `meta:` at root | Remove it, only `sections:` at root |
| `required: false` | Use evaluation syntax or remove |

## Version Management

### Development Versions

Use `-dev.N` suffix for development:
```yaml
# app.yml
version: 1.0.0-dev.1
```

- No review required
- Immediate publishing
- Private to your account

### Incrementing Versions

When updating, increment the dev number:
```yaml
version: 1.0.0-dev.2  # Was dev.1
```

Then redeploy:
```bash
yarn build && yarn validate
ocp app prepare
ocp directory publish {{APP_ID}}@1.0.0-dev.2
ocp directory install {{APP_ID}}@1.0.0-dev.2 TRACKER_ID
```

## Troubleshooting

### Build Fails with Registry Error

```
https://registry.yarnpkg.com/%5E3.0.11: Not found
```

**Fix:** Add to package.json:
```json
"resolutions": {
  "grpc-boom": "3.0.11"
}
```

### "Command 'lint' not found"

**Fix:** Add placeholder scripts:
```json
"lint": "echo 'No linter configured'",
"test": "echo 'No tests configured'"
```

### Build Fails - Check Logs

```bash
# Get build ID from prepare output
ocp app logs --buildId=BUILD_NUMBER
```

### Settings Form Validation Errors

- "must have required property 'help'" → Use `help:` not `helpText:`
- "must have required property 'text'" → In options, use `text:` not `label:`
- "must NOT have additional properties" → Remove `meta:` block

### Installation Fails

1. Check `onInstall()` doesn't throw errors
2. Verify tracker ID: `ocp accounts whois`
3. Check correct shard: `-a=eu` for EU accounts

## File Structure

```
{{APP_ID}}/
├── src/
│   ├── index.ts                    # Exports OpalToolFunction, Lifecycle
│   ├── functions/
│   │   └── OpalToolFunction.ts     # @tool decorated methods
│   └── lifecycle/
│       └── Lifecycle.ts            # onInstall, onUpgrade, etc.
├── forms/
│   └── settings.yml                # Settings UI definition
├── assets/
│   ├── icon.svg                    # 64x64 square icon
│   ├── logo.svg                    # Horizontal logo
│   └── directory/
│       └── overview.md             # App Directory description
├── app.yml                         # App manifest
├── package.json                    # Scripts, deps, resolutions
└── tsconfig.json                   # TypeScript config
```

## Tool Definition Pattern

```typescript
import 'reflect-metadata';
import { ToolFunction, tool, ParameterType } from '@optimizely-opal/opal-tool-ocp-sdk';

export class OpalToolFunction extends ToolFunction {
  @tool({
    name: 'tool_name',              // snake_case
    description: 'What this tool does',
    endpoint: '/tools/tool-name',   // kebab-case
    parameters: [
      {
        name: 'param_name',         // snake_case
        type: ParameterType.String,
        description: 'Parameter description',
        required: true
      }
    ]
  })
  async toolName(
    parameters: { param_name: string },
    authData?: Record<string, unknown>
  ): Promise<{ result: string }> {
    // Implementation
    return { result: 'value' };
  }
}
```

## Lifecycle Hooks

```typescript
import { Lifecycle as BaseLifecycle, LifecycleResult, logger } from '@zaiusinc/app-sdk';

export class Lifecycle extends BaseLifecycle {
  async onInstall(): Promise<LifecycleResult> {
    logger.info('App installed');
    return { success: true };
  }

  async onUpgrade(fromVersion: string): Promise<LifecycleResult> {
    logger.info(`Upgrading from ${fromVersion}`);
    return { success: true };
  }

  async onUninstall(): Promise<LifecycleResult> {
    logger.info('App uninstalled');
    return { success: true };
  }
}
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `OpalToolFunction` |
| Methods | camelCase | `calculateSize` |
| Tool names | snake_case | `calculate_size` |
| Parameters | snake_case | `sample_size` |
| Endpoints | kebab-case | `/tools/calculate-size` |
| App ID | kebab-case | `my-opal-tool` |

## Common Tasks

### Add a New Tool

1. Add method to `src/functions/OpalToolFunction.ts`
2. Decorate with `@tool({ name, description, endpoint, parameters })`
3. Run `yarn validate`
4. Increment version and redeploy

### Update Settings Form

1. Edit `forms/settings.yml`
2. Use correct property names (`help`, `text`)
3. Run `yarn validate`
4. Redeploy

### Check Deployment Status

```bash
# List your accounts
ocp accounts whoami

# Check app in account
# Navigate to Apps in OCP UI
```

## Multi-Shard Deployment

```yaml
# app.yml
availability:
  - us
  - eu
  - au
```

```bash
# Install to EU shard
ocp directory install {{APP_ID}}@VERSION TRACKER_ID -a=eu
```

## Production Release

1. Remove `-dev.N` suffix from version
2. Run `ocp app prepare` and accept review
3. Wait for approval (1-2 business days)
4. Publish: `ocp directory publish {{APP_ID}}@1.0.0`

## OCP CLI Reference

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

## Learn More

- [OCP Documentation](https://docs.developers.optimizely.com/optimizely-connect-platform/docs)
- [Configure OCP Development Environment](https://docs.developers.optimizely.com/optimizely-connect-platform/docs/configure-your-development-environment-ocp2)
- [Opal Tool SDK](https://www.npmjs.com/package/@optimizely-opal/opal-tool-ocp-sdk)

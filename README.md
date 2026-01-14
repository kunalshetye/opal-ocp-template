# OCP Opal Tool Template

A template for building Opal tools on Optimizely Connect Platform (OCP).

## Quick Start

### 1. Create Your Project

Click "Use this template" on GitHub, or clone and reinitialize:

```bash
git clone https://github.com/YOUR_USERNAME/opal_ocp_template.git my-opal-tool
cd my-opal-tool
rm -rf .git
git init
```

### 2. Configure Your App

Replace placeholders in these files:

**package.json:**
- `{{APP_ID}}` - Your app ID (e.g., `my_awesome_tool`)

**app.yml:**
- `{{APP_ID}}` - Same as above
- `{{APP_DISPLAY_NAME}}` - Human-readable name (e.g., `My Awesome Tool`)
- `{{APP_SUMMARY}}` - Short description
- `{{GITHUB_USERNAME}}` - Your GitHub username
- `{{REPO_NAME}}` - Your repository name
- `{{CONTACT_EMAIL}}` - Support email
- `{{TOOL_DESCRIPTION}}` - Description of what your tool does

**assets/directory/overview.md:**
- Update with your tool's documentation

### 3. Install Dependencies

```bash
# Requires Node.js >= 22.0.0
nvm use 22  # if using nvm
yarn install
```

### 4. Implement Your Tools

Edit `src/functions/OpalToolFunction.ts`:
- Replace example tools with your actual implementations
- Use the `@tool` decorator for each tool method

### 5. Build & Validate

```bash
yarn build
yarn validate
```

### 6. Register & Deploy

```bash
# First time only - register your app
ocp app register

# Get your tracker ID
ocp accounts whoami

# Prepare, publish, and install
ocp app prepare
ocp directory publish YOUR_APP_ID@1.0.0-dev.1
ocp directory install YOUR_APP_ID@1.0.0-dev.1 YOUR_TRACKER_ID
```

## Project Structure

```
├── src/
│   ├── index.ts                 # Main entry point
│   ├── functions/
│   │   └── OpalToolFunction.ts  # Your tool implementations
│   └── lifecycle/
│       └── Lifecycle.ts         # OCP lifecycle hooks
├── forms/
│   └── settings.yml             # Settings form definition
├── assets/
│   ├── icon.svg                 # App icon (64x64)
│   ├── logo.svg                 # App logo (200x64)
│   └── directory/
│       └── overview.md          # App Directory description
├── app.yml                      # OCP app manifest
├── package.json                 # Dependencies and scripts
└── tsconfig.json                # TypeScript configuration
```

## Adding Tools

Use the `@tool` decorator to add new tools:

```typescript
@tool({
  name: 'my_tool',
  description: 'Description shown to Opal',
  endpoint: '/tools/my-tool',
  parameters: [
    {
      name: 'param1',
      type: ParameterType.String,
      description: 'Parameter description',
      required: true
    }
  ]
})
async myTool(
  parameters: { param1: string },
  authData?: Record<string, unknown>
): Promise<{ result: string }> {
  // Your implementation
  return { result: 'success' };
}
```

### Parameter Types

- `ParameterType.String`
- `ParameterType.Number`
- `ParameterType.Boolean`
- `ParameterType.Object`
- `ParameterType.Array`

## Settings Form

Edit `forms/settings.yml` to add configuration options:

```yaml
sections:
  - key: section_key
    label: Section Label
    elements:
      - key: field_key
        label: Field Label
        type: select          # or: text, toggle, secret
        help: Help text here  # Required! Use 'help' not 'helpText'
        options:              # For select type
          - value: val1
            text: Display 1   # Required! Use 'text' not 'label'
          - value: val2
            text: Display 2
```

## Lifecycle Hooks

The `Lifecycle.ts` file handles app lifecycle events:

- `onInstall()` - Called when app is installed
- `onUpgrade(fromVersion)` - Called during upgrades
- `onFinalizeUpgrade(fromVersion)` - Called after upgrade
- `onUninstall()` - Called when app is uninstalled
- `onSettingsForm(section, action, formData)` - Handles settings saves

## Troubleshooting

### Build Fails with "%5E3.0.11: Not found"

Ensure `package.json` has the grpc-boom resolution:

```json
{
  "resolutions": {
    "grpc-boom": "3.0.11"
  }
}
```

### Build Fails with "Command 'lint' not found"

Ensure `package.json` has lint and test scripts:

```json
{
  "scripts": {
    "lint": "echo 'No linter configured'",
    "test": "echo 'No tests configured'"
  }
}
```

### Validation Fails for settings.yml

- Use `help:` not `helpText:`
- Use `text:` not `label:` in select options
- Don't include `meta:` at root level

### Checking Build Logs

```bash
ocp app logs --buildId=BUILD_NUMBER
```

## Deployment Commands Reference

```bash
# Build
yarn build

# Validate locally
yarn validate

# Prepare for upload
ocp app prepare

# Publish (dev version)
ocp directory publish APP_ID@VERSION

# Install to account
ocp directory install APP_ID@VERSION TRACKER_ID

# Check build logs
ocp app logs --buildId=NUMBER

# Get tracker ID
ocp accounts whoami
```

## License

MIT

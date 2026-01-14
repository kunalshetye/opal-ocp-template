# {{APP_DISPLAY_NAME}}

{{APP_DESCRIPTION}}

## Quick Start

```bash
# Install dependencies
yarn install

# Build the project
yarn build

# Validate configuration
yarn validate
```

## Project Structure

```
{{APP_ID}}/
├── src/
│   ├── index.ts                    # Entry point
│   ├── functions/
│   │   └── OpalToolFunction.ts     # Tool implementations
│   └── lifecycle/
│       └── Lifecycle.ts            # OCP lifecycle hooks
├── forms/
│   └── settings.yml                # Settings form definition
├── assets/
│   ├── icon.svg                    # App icon
│   ├── logo.svg                    # App logo
│   └── directory/
│       └── overview.md             # App Directory description
├── app.yml                         # OCP app manifest
├── package.json
└── tsconfig.json
```

## Available Tools

This OCP Opal Tool exposes the following tools to Opal:

### hello_world

Generates a friendly greeting message.

**Parameters:**
- `name` (required): The name of the person to greet
- `greeting_style` (optional): Style of greeting - "formal", "casual", or "enthusiastic"

### get_info

Returns information about this tool.

## Deployment

```bash
# Register the app with OCP
ocp app register

# Prepare for publishing
ocp app prepare

# Publish to the App Directory
ocp directory publish {{APP_ID}}@1.0.0

# Install to your account
ocp directory install {{APP_ID}}@1.0.0 {{TRACKER_ID}}
```

## Development

### Adding a New Tool

1. Add a new method to `src/functions/OpalToolFunction.ts`
2. Decorate it with the `@tool` decorator
3. Add the endpoint to `app.yml`
4. Run `yarn validate` to check configuration

### Settings

Settings are defined in `forms/settings.yml` and stored using the OCP storage API.

## Learn More

- [OCP Documentation](https://docs.developers.optimizely.com/)
- [Opal Tool SDK](https://www.npmjs.com/package/@optimizely-opal/opal-tool-ocp-sdk)

## Support

For issues and questions, visit: https://github.com/{{GITHUB_USERNAME}}/{{REPO_NAME}}/issues

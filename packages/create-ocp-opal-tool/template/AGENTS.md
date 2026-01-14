# AGENTS.md

This file provides guidance for AI coding agents working with this OCP Opal Tool project.

## Project Overview

This is an **OCP Opal Tool** built using the `@optimizely-opal/opal-tool-ocp-sdk`. Tools are exposed to Opal (Optimizely's AI assistant) via decorated methods.

- **Runtime:** Node.js 22+
- **Language:** TypeScript 5.x (strict mode)
- **Package Manager:** Yarn 1.x (Classic) - **required by OCP**

## Build/Lint/Test Commands

```bash
# Install dependencies (must use Yarn 1.x)
yarn install

# Build the project
yarn build

# Validate the app configuration against OCP requirements
yarn validate

# Clean build artifacts
yarn clean

# Compile TypeScript only
yarn compile
```

## OCP Deployment Commands

```bash
# Register app with OCP (first time only)
ocp app register

# Prepare app for publishing
ocp app prepare

# Publish to directory
ocp directory publish {{APP_ID}}@VERSION

# Install to account
ocp directory install {{APP_ID}}@VERSION TRACKER_ID
```

## Project Structure

```
{{APP_ID}}/
├── src/
│   ├── index.ts                    # Entry point - exports all modules
│   ├── functions/
│   │   └── OpalToolFunction.ts     # Tool implementations (@tool decorated)
│   └── lifecycle/
│       └── Lifecycle.ts            # OCP lifecycle hooks
├── forms/
│   └── settings.yml                # Settings form definition (YAML)
├── assets/
│   ├── icon.svg                    # App icon (square)
│   ├── logo.svg                    # App logo (horizontal)
│   └── directory/
│       └── overview.md             # App Directory description
├── app.yml                         # OCP app manifest
├── package.json
├── tsconfig.json
└── README.md
```

## Key Files

- **`app.yml`** - App manifest defining metadata, runtime, and endpoints
- **`src/functions/OpalToolFunction.ts`** - Main tool implementations
- **`src/lifecycle/Lifecycle.ts`** - Installation and configuration hooks
- **`forms/settings.yml`** - Settings form schema

## Code Style Guidelines

### TypeScript Configuration

Strict mode is enabled with the following key settings:
- `strict: true` - All strict type-checking options
- `experimentalDecorators: true` - Required for `@tool` decorator
- `emitDecoratorMetadata: true` - Required for decorator reflection
- `esModuleInterop: true` - CommonJS/ES module interop

### Import Ordering

Follow this order for imports:

```typescript
// 1. Reflect metadata (required for decorators)
import 'reflect-metadata';

// 2. Third-party SDK imports
import { ToolFunction, tool, ParameterType } from '@optimizely-opal/opal-tool-ocp-sdk';
import { Lifecycle as BaseLifecycle, logger, storage } from '@zaiusinc/app-sdk';

// 3. Local imports (relative paths)
import { MyHelper } from './helpers/MyHelper';
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `OpalToolFunction`, `Lifecycle` |
| Methods | camelCase | `helloWorld`, `getInfo`, `onInstall` |
| Tool names (decorator) | snake_case | `hello_world`, `get_info` |
| Parameters (decorator) | snake_case | `greeting_style`, `user_name` |
| Variables | camelCase | `greeting`, `userName` |
| Endpoints | kebab-case | `/tools/hello-world` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `DEFAULT_TIMEOUT` |

### Type Annotations

Always use explicit return types on methods:

```typescript
// Good - explicit return type
async helloWorld(
  parameters: { name: string; greeting_style?: string },
  authData?: Record<string, unknown>
): Promise<{
  message: string;
  timestamp: string;
}> {
  // implementation
}

// Avoid - implicit return type
async helloWorld(parameters: { name: string }) {
  // ...
}
```

Use `Record<string, unknown>` for generic object types, not `any` or `object`.

### Error Handling

Use the SDK's result builder pattern for lifecycle methods:

```typescript
// Return success
return { success: true };

// Return errors using the result builder
return new LifecycleSettingsResult()
  .addError('field_name', 'Error message describing the issue');
```

For tool methods, throw errors or return error objects as appropriate:

```typescript
async myTool(params: { id: string }): Promise<{ data: unknown } | { error: string }> {
  try {
    const result = await fetchData(params.id);
    return { data: result };
  } catch (error) {
    return { error: `Failed to fetch: ${error.message}` };
  }
}
```

### Tool Definition Pattern

Use the `@tool` decorator with full configuration:

```typescript
@tool({
  name: 'tool_name',  // snake_case
  description: 'Clear description of what this tool does and when to use it',
  endpoint: '/tools/tool-name',  // kebab-case endpoint
  parameters: [
    {
      name: 'param_name',  // snake_case
      type: ParameterType.String,
      description: 'Description of this parameter',
      required: true
    }
  ]
})
async toolName(
  parameters: { param_name: string },
  authData?: Record<string, unknown>
): Promise<{ result: string }> {
  // implementation
}
```

### Comments and Documentation

Use JSDoc block comments for classes and public methods:

```typescript
/**
 * Brief description of the class.
 *
 * Additional details about usage and behavior.
 */
export class MyClass extends ToolFunction {
  /**
   * Brief description of the method.
   * @param parameters - Description of parameters object
   * @returns Description of return value
   */
  async myMethod(parameters: { name: string }): Promise<{ result: string }> {
    // Inline comments for complex logic only
    const result = await this.process(parameters.name);
    return { result };
  }
}
```

## Common Patterns

### Adding a New Tool

1. Add the method to `src/functions/OpalToolFunction.ts`
2. Decorate with `@tool` including all metadata
3. Add endpoint to `app.yml` under the `opal_tools` runtime
4. Build and validate: `yarn build && yarn validate`

### Settings Storage

Use the SDK's storage API for persistent settings:

```typescript
import { storage } from '@zaiusinc/app-sdk';

// Store settings
await storage.settings.put('key', value);

// Retrieve settings
const value = await storage.settings.get('key');
```

### Logging

Use the SDK's logger for consistent logging:

```typescript
import { logger } from '@zaiusinc/app-sdk';

logger.info('Operation completed', { context: 'value' });
logger.error('Operation failed', { error: err.message });
```

## Validation

Always run validation before deployment:

```bash
yarn validate
```

This checks:
- App manifest correctness
- Endpoint configurations
- Form schema validity
- Required assets

## Critical package.json Requirements

The OCP build process has specific requirements. **Always include these:**

```json
{
  "scripts": {
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

**Why:**
- `lint` and `test` scripts are **required** by OCP build, even if empty
- `grpc-boom` resolution prevents `https://registry.yarnpkg.com/%5E3.0.11: Not found` error
- Node 22+ is required by `@optimizely-opal/opal-tool-ocp-sdk`

## forms/settings.yml Schema

**Correct property names (common mistakes):**

| Wrong | Correct |
|-------|---------|
| `helpText:` | `help:` |
| `label:` (in options) | `text:` |
| `meta:` at root level | Remove it |
| `required: false` | Use evaluation syntax |

**Correct structure:**
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

## Deployment Workflow

### Development Deployment

```bash
# 1. Build and validate
yarn build && yarn validate

# 2. Get tracker ID (first time)
ocp accounts whoami
ocp accounts whois ACCOUNT_NAME

# 3. Prepare, publish, install
ocp app prepare
ocp directory publish {{APP_ID}}@1.0.0-dev.1
ocp directory install {{APP_ID}}@1.0.0-dev.1 TRACKER_ID
```

### Updating Deployments

1. Increment version in `app.yml`: `1.0.0-dev.1` → `1.0.0-dev.2`
2. Rebuild and redeploy:
```bash
yarn build && yarn validate
ocp app prepare
ocp directory publish {{APP_ID}}@1.0.0-dev.2
ocp directory install {{APP_ID}}@1.0.0-dev.2 TRACKER_ID
```

### Check Build Logs

If `ocp app prepare` fails:
```bash
ocp app logs --buildId=BUILD_NUMBER
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `Command "lint" not found` | Add `"lint": "echo 'No linter configured'"` to scripts |
| `Command "test" not found` | Add `"test": "echo 'No tests configured'"` to scripts |
| `registry.yarnpkg.com/%5E3.0.11: Not found` | Add `"grpc-boom": "3.0.11"` to resolutions |
| `must have required property 'help'` | Use `help:` not `helpText:` in forms |
| `must have required property 'text'` | Use `text:` not `label:` in select options |
| `must NOT have additional properties` | Remove `meta:` block from forms/settings.yml |
| `Version already exists` | Increment version in app.yml |

## Learn More

- [OCP Documentation](https://docs.developers.optimizely.com/optimizely-connect-platform/docs)
- [Configure OCP Development Environment](https://docs.developers.optimizely.com/optimizely-connect-platform/docs/configure-your-development-environment-ocp2)
- [Opal Tool SDK](https://www.npmjs.com/package/@optimizely-opal/opal-tool-ocp-sdk)

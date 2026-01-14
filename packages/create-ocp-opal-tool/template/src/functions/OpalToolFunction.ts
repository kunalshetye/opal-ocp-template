import 'reflect-metadata';
import {
  ToolFunction,
  tool,
  ParameterType,
  OptiIdAuthData
} from '@optimizely-opal/opal-tool-ocp-sdk';

/**
 * OCP Opal Tool Function.
 *
 * This class contains the tool methods that will be exposed to Opal.
 * Each method decorated with @tool will be available as a tool in Opal.
 *
 * Key concepts:
 * - Use @tool decorator to expose methods to Opal
 * - Tool names should be snake_case (e.g., hello_world)
 * - Endpoints should be kebab-case (e.g., /tools/hello-world)
 * - Detailed descriptions help Opal understand when to use each tool
 * - Use authData parameter when your tool needs user credentials
 */
export class OpalToolFunction extends ToolFunction {

  /**
   * Example tool: Generates a greeting message.
   *
   * This is a simple example that doesn't require authentication.
   * Replace this with your actual tool implementation.
   */
  @tool({
    name: 'hello_world',
    description: `
      Generates a friendly greeting message for a given name.

      Use this tool when:
      - The user wants to greet someone
      - Testing that the Opal tool is working correctly

      Do NOT use this tool when:
      - The user is asking for information (use get_info instead)
      - The user wants to perform actions on external systems

      Example usage:
      - "Say hello to John" -> { name: "John" }
      - "Greet Sarah formally" -> { name: "Sarah", greeting_style: "formal" }
    `,
    endpoint: '/tools/hello-world',
    parameters: [
      {
        name: 'name',
        type: ParameterType.String,
        description: 'The name of the person to greet',
        required: true
      },
      {
        name: 'greeting_style',
        type: ParameterType.String,
        description: 'The style of greeting: "formal", "casual", or "enthusiastic". Defaults to "casual" if not specified.',
        required: false
      }
    ]
  })
  async helloWorld(
    parameters: { name: string; greeting_style?: string },
    authData?: OptiIdAuthData
  ): Promise<{
    message: string;
    name: string;
    style: string;
    timestamp: string;
  }> {
    const name = parameters.name;
    const style = parameters.greeting_style || 'casual';

    let greeting: string;
    switch (style) {
      case 'formal':
        greeting = `Good day, ${name}. It is a pleasure to make your acquaintance.`;
        break;
      case 'enthusiastic':
        greeting = `Hey ${name}! SO awesome to meet you! This is going to be GREAT!`;
        break;
      case 'casual':
      default:
        greeting = `Hey ${name}! Nice to meet you!`;
        break;
    }

    return {
      message: greeting,
      name: name,
      style: style,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Example tool: Returns information about this tool.
   *
   * This demonstrates a simple tool with no parameters.
   */
  @tool({
    name: 'get_info',
    description: `
      Returns information about this Opal tool, including version and capabilities.

      Use this tool when:
      - The user asks what this tool can do
      - The user wants to know the tool version
      - The user is troubleshooting or testing the integration

      Returns: Tool name, version, description, and list of available capabilities.
    `,
    endpoint: '/tools/info',
    parameters: []
  })
  async getInfo(
    parameters: Record<string, never>,
    authData?: OptiIdAuthData
  ): Promise<{
    name: string;
    version: string;
    description: string;
    capabilities: string[];
  }> {
    return {
      name: '{{APP_DISPLAY_NAME}}',
      version: '1.0.0',
      description: '{{APP_DESCRIPTION}}',
      capabilities: [
        'hello_world - Generate greeting messages',
        'get_info - Get tool information'
      ]
    };
  }

  // ============================================================================
  // EXAMPLE: Tool with Authentication
  // ============================================================================
  // Uncomment and modify this example when you need to access external APIs
  // that require user credentials configured in the settings form.
  //
  // @tool({
  //   name: 'get_external_data',
  //   description: `
  //     Fetches data from an external API using configured credentials.
  //
  //     This tool requires the user to have configured API credentials
  //     in the app settings form.
  //   `,
  //   endpoint: '/tools/external-data',
  //   parameters: [
  //     {
  //       name: 'resource_id',
  //       type: ParameterType.String,
  //       description: 'The ID of the resource to fetch',
  //       required: true
  //     }
  //   ],
  //   authRequirements: [{
  //     provider: 'OptiID',
  //     scopeBundle: '{{APP_ID}}',
  //     required: true
  //   }]
  // })
  // async getExternalData(
  //   parameters: { resource_id: string },
  //   authData?: OptiIdAuthData
  // ): Promise<{ success: boolean; data?: unknown; error?: string }> {
  //   try {
  //     // Extract credentials from authData
  //     if (!authData?.credentials) {
  //       throw new Error('API credentials not configured. Please set up credentials in app settings.');
  //     }
  //
  //     const credentials = authData.credentials as {
  //       api_url?: string;
  //       api_key?: string;
  //     };
  //
  //     // Use credentials to call external API
  //     // const response = await fetch(`${credentials.api_url}/resource/${parameters.resource_id}`, {
  //     //   headers: { 'Authorization': `Bearer ${credentials.api_key}` }
  //     // });
  //
  //     return {
  //       success: true,
  //       data: { id: parameters.resource_id, message: 'Replace with actual API call' }
  //     };
  //   } catch (error: any) {
  //     return {
  //       success: false,
  //       error: error.message || 'Failed to fetch data'
  //     };
  //   }
  // }
}

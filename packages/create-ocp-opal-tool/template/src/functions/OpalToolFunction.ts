import 'reflect-metadata';
import { ToolFunction, tool, ParameterType } from '@optimizely-opal/opal-tool-ocp-sdk';

/**
 * OCP Opal Tool Function.
 *
 * This class contains the tool methods that will be exposed to Opal.
 * Each method decorated with @tool will be available as a tool in Opal.
 */
export class OpalToolFunction extends ToolFunction {

  /**
   * Example tool: Generates a greeting message.
   *
   * Replace this with your actual tool implementation.
   */
  @tool({
    name: 'hello_world',
    description: 'Generates a friendly greeting message for a given name',
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
        description: 'The style of greeting: "formal", "casual", or "enthusiastic"',
        required: false
      }
    ]
  })
  async helloWorld(
    parameters: { name: string; greeting_style?: string },
    authData?: Record<string, unknown>
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
   * Replace or extend this with your actual tool implementation.
   */
  @tool({
    name: 'get_info',
    description: 'Returns information about this Opal tool, including version and capabilities',
    endpoint: '/tools/info',
    parameters: []
  })
  async getInfo(
    parameters: Record<string, never>,
    authData?: Record<string, unknown>
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
}

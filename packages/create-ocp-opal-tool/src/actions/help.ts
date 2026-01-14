/**
 * Help - display usage information
 */

import pc from 'picocolors';

export function help(): void {
  console.log(`
${pc.bold('ocp-opal-wizard')} - Scaffold OCP Opal Tool projects

${pc.dim('A CLI wizard for creating Optimizely Connect Platform (OCP) Opal Tools')}

${pc.cyan('Usage:')}
  ${pc.dim('$')} npx @kunalshetye/ocp-opal-wizard create [directory] [options]

${pc.cyan('Commands:')}
  ${pc.bold('create [directory]')}   Create a new OCP Opal Tool project

${pc.cyan('Options:')}
  ${pc.bold('-y, --yes')}            Skip prompts, use defaults
  ${pc.bold('--no-git')}             Skip git initialization
  ${pc.bold('--dry-run')}            Show what would be done without making changes

  ${pc.bold('--app-id')}             OCP App ID
  ${pc.bold('--display-name')}       App display name
  ${pc.bold('--description')}        App description
  ${pc.bold('--tracker-id')}         OCP Tracker ID for deployment
  ${pc.bold('--email')}              Contact email

  ${pc.bold('-h, --help')}           Show this help message
  ${pc.bold('-v, --version')}        Show version number

${pc.cyan('Examples:')}
  ${pc.dim('# Interactive wizard')}
  ${pc.dim('$')} npx @kunalshetye/ocp-opal-wizard create

  ${pc.dim('# Create in specific directory')}
  ${pc.dim('$')} npx @kunalshetye/ocp-opal-wizard create my-tool

  ${pc.dim('# Quick setup with defaults')}
  ${pc.dim('$')} npx @kunalshetye/ocp-opal-wizard create my-tool --yes

  ${pc.dim('# Specify app details')}
  ${pc.dim('$')} npx @kunalshetye/ocp-opal-wizard create my-tool --app-id my-app --tracker-id ABC123

${pc.cyan('Note:')}
  Always use ${pc.bold('npx')} to run the wizard (not yarn create).
  The scaffolded project uses Yarn 1.x as required by OCP.

${pc.cyan('Learn more:')}
  Documentation: ${pc.underline('https://docs.developers.optimizely.com/')}
  Repository:    ${pc.underline('https://github.com/kunalshetye/opal-ocp-template')}
`);
}

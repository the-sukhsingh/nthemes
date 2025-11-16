#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { generateThemeFiles } = require('../src/generator');

async function main() {
  console.log(chalk.blue.bold('\n✨ Next Theme OneShot CLI\n'));
  console.log(chalk.gray('Setting up next-themes in your Next.js project...\n'));

  try {
    // Prompt user for configuration
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'componentsPath',
        message: 'Where should the components be created? (relative path)',
        default: 'src/components',
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'Path cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'useTypeScript',
        message: 'Use TypeScript?',
        default: true,
      },
      {
        type: 'checkbox',
        name: 'components',
        message: 'Which components would you like to create?',
        choices: ['ThemeProvider', 'ThemeToggle'],
        default: ['ThemeProvider', 'ThemeToggle'],
        validate: (input) => {
          if (input.length === 0) {
            return 'Please select at least one component';
          }
          return true;
        },
      },
    ]);

    // Generate files
    const cwd = process.cwd();
    const componentsPath = path.join(cwd, answers.componentsPath);
    
    console.log(chalk.gray('\nGenerating files...\n'));

    await generateThemeFiles(componentsPath, answers.useTypeScript, answers.components);
    
    // Install next-themes and Lucide-react
    console.log(chalk.gray('Installing dependencies...\n'));
    const { execSync } = require('child_process');
    execSync('npm install next-themes lucide-react', { stdio: 'inherit' });

    console.log(chalk.green.bold('✅ Success! Theme files created.\n'));
    console.log(chalk.yellow('📝 Next steps:\n'))
    console.log(chalk.white(`1. Wrap your app with ThemeProvider in ${chalk.cyan('layout.tsx')}.`));
    console.log(chalk.white(`2. Use ThemeToggle component wherever you need theme switching\n`));

    console.log(chalk.blue.bold('Happy Theming! 🚀\n'));
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Error: ' + error.message + '\n'));
    process.exit(1);
  }
}

main();

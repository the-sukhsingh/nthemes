#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { generateThemeFiles } = require('../src/generator');
const { transitions } = require('../src/transitions');

function detectTypeScript(cwd) {
  const tsconfigExists = fs.existsSync(path.join(cwd, 'tsconfig.json'));
  if (tsconfigExists) return true;

  try {
    const pkgPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = fs.readJsonSync(pkgPath);
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (allDeps.typescript) return true;
    }
  } catch (e) {
    // Ignore read errors
  }
  return false;
}

function detectSrcDirectory(cwd) {
  return fs.existsSync(path.join(cwd, 'src'));
}

function detectPackageManager(cwd) {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) {
    return 'bun';
  }
  return 'npm';
}

function detectLayoutFile(cwd) {
  const possiblePaths = [
    'src/app/layout.tsx',
    'src/app/layout.jsx',
    'src/app/layout.js',
    'app/layout.tsx',
    'app/layout.jsx',
    'app/layout.js',
    'src/pages/_app.tsx',
    'src/pages/_app.jsx',
    'src/pages/_app.js',
    'pages/_app.tsx',
    'pages/_app.jsx',
    'pages/_app.js',
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(path.join(cwd, p))) {
      return p;
    }
  }
  return null;
}

function detectGlobalsCssFile(cwd) {
  const possiblePaths = [
    'src/app/globals.css',
    'app/globals.css',
    'src/styles/globals.css',
    'styles/globals.css',
    'src/globals.css',
    'globals.css',
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(path.join(cwd, p))) {
      return p;
    }
  }
  return null;
}

function getInstallCommand(packageManager, dependencies) {
  const depString = dependencies.join(' ');
  switch (packageManager) {
    case 'pnpm':
      return `pnpm add ${depString}`;
    case 'yarn':
      return `yarn add ${depString}`;
    case 'bun':
      return `bun add ${depString}`;
    default:
      return `npm install ${depString}`;
  }
}

async function main() {
  const cwd = process.cwd();
  
  console.log(chalk.blue.bold('\n✨ Next Theme OneShot CLI\n'));
  console.log(chalk.gray('Setting up next-themes in your Next.js project...\n'));

  // Run auto-detections
  const isTypeScript = detectTypeScript(cwd);
  const hasSrcDir = detectSrcDirectory(cwd);
  const packageManager = detectPackageManager(cwd);
  const detectedGlobalsCss = detectGlobalsCssFile(cwd);

  if (isTypeScript) {
    console.log(chalk.gray(`🔍 Detected TypeScript project.`));
  } else {
    console.log(chalk.gray(`🔍 Detected JavaScript project.`));
  }
  if (detectedGlobalsCss) {
    console.log(chalk.gray(`🔍 Detected global CSS file: ${chalk.bold(detectedGlobalsCss)}`));
  }
  console.log(chalk.gray(`📦 Detected package manager: ${chalk.bold(packageManager)}\n`));

  try {
    // Prompt user for configuration
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'componentsPath',
        message: 'Where should the components be created? (relative path)',
        default: hasSrcDir ? 'src/components/theme' : 'components/theme',
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
        default: isTypeScript,
      },
      {
        type: 'checkbox',
        name: 'components',
        message: 'Which components would you like to create?',
        choices: ['ThemeProvider', 'ThemeToggle', 'Provider'],
        default: ['ThemeProvider', 'ThemeToggle', 'Provider'],
        validate: (input) => {
          if (input.length === 0) {
            return 'Please select at least one component';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'addTransitions',
        message: 'Add view transitions for the theme toggle?',
        default: true,
        when: (answers) => answers.components.includes('ThemeToggle'),
      },
      {
        type: 'list',
        name: 'transitionStyle',
        message: 'Select transition style:',
        choices: Object.keys(transitions).map((key) => ({
          name: transitions[key].name,
          value: key,
        })),
        default: 'circle',
        when: (answers) => answers.components.includes('ThemeToggle') && answers.addTransitions,
      },
      {
        type: 'confirm',
        name: 'appendDetectedCss',
        message: () => `Detected global CSS file at '${detectedGlobalsCss}'. Append transition styles to it?`,
        default: true,
        when: (answers) => answers.components.includes('ThemeToggle') && answers.addTransitions && !!detectedGlobalsCss,
      },
      {
        type: 'input',
        name: 'customCssPath',
        message: 'Path to your global CSS file (leave empty to generate a standalone \'theme-transitions.css\' next to the toggle component):',
        when: (answers) => answers.components.includes('ThemeToggle') && answers.addTransitions && (!detectedGlobalsCss || !answers.appendDetectedCss),
      },
    ]);

    // Generate files
    const componentsPath = path.join(cwd, answers.componentsPath);
    
    console.log(chalk.gray('\nGenerating files...\n'));

    const selectedTransition = answers.addTransitions ? answers.transitionStyle : null;
    let targetCssFile = null;
    if (answers.addTransitions) {
      if (detectedGlobalsCss && answers.appendDetectedCss) {
        targetCssFile = detectedGlobalsCss;
      } else if (answers.customCssPath && answers.customCssPath.trim() !== '') {
        targetCssFile = answers.customCssPath.trim();
      }
    }

    await generateThemeFiles(
      componentsPath,
      answers.useTypeScript,
      answers.components,
      selectedTransition,
      targetCssFile
    );
    
    // Install next-themes dependency
    console.log(chalk.gray('\nInstalling dependencies...\n'));
    const installCmd = getInstallCommand(packageManager, ['next-themes']);
    
    console.log(chalk.gray(`Running: ${chalk.cyan(installCmd)}`));
    const { execSync } = require('child_process');
    execSync(installCmd, { stdio: 'inherit' });

    // Detect layout / app wrapper page
    const layoutFile = detectLayoutFile(cwd);
    const layoutHint = layoutFile 
      ? chalk.cyan(layoutFile) 
      : chalk.cyan(answers.useTypeScript ? 'layout.tsx / _app.tsx' : 'layout.js / _app.js');

    console.log(chalk.green.bold('\n✅ Success! Theme files created.\n'));
    console.log(chalk.yellow('📝 Next steps:\n'));
    let stepCount = 1;
    console.log(chalk.white(`${stepCount++}. Wrap your app with the ${chalk.cyan('Provider')} in ${layoutHint}.`));
    console.log(chalk.white(`${stepCount++}. Use the ${chalk.cyan('ModeToggle')} component (exported from ThemeToggle) wherever you need theme switching.`));
    if (selectedTransition) {
      if (targetCssFile) {
        console.log(chalk.white(`${stepCount++}. Transition styles have been appended to ${chalk.cyan(targetCssFile)}.`));
      } else {
        console.log(chalk.white(`${stepCount++}. Import the standalone transition styles ${chalk.cyan("import './theme-transitions.css'")} inside your layout or global css file.`));
      }
    }
    console.log();

    console.log(chalk.blue.bold('Happy Theming! 🚀\n'));
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Error: ' + error.message + '\n'));
    process.exit(1);
  }
}

main();

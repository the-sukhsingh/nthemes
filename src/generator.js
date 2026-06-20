const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { getThemeProviderTemplate, getThemeToggleTemplate, getProviderTemplate } = require('./templates');
const { transitions, expoTimingFunctions } = require('./transitions');

async function generateThemeFiles(componentsPath, useTypeScript, components, transitionStyle, globalsCssPath) {
  // Ensure the components directory exists
  await fs.ensureDir(componentsPath);

  const ext = useTypeScript ? 'tsx' : 'jsx';
  const createdFiles = [];
  const cwd = process.cwd();

  try {
    // Generate ThemeProvider
    if (components.includes('ThemeProvider')) {
      const themeProviderPath = path.join(componentsPath, `ThemeProvider.${ext}`);
      const themeProviderContent = getThemeProviderTemplate(useTypeScript);
      await fs.writeFile(themeProviderPath, themeProviderContent);
      createdFiles.push(`✓ ${chalk.cyan(path.relative(cwd, themeProviderPath))}`);
    }

    // Generate ThemeToggle
    if (components.includes('ThemeToggle')) {
      const themeTogglePath = path.join(componentsPath, `ThemeToggle.${ext}`);
      const themeToggleContent = getThemeToggleTemplate(useTypeScript, transitionStyle);
      await fs.writeFile(themeTogglePath, themeToggleContent);
      createdFiles.push(`✓ ${chalk.cyan(path.relative(cwd, themeTogglePath))}`);

      // Handle CSS Generation
      if (transitionStyle && transitions[transitionStyle]) {
        if (globalsCssPath) {
          const cssBlock = `\n/* nthemes: theme toggle transitions */\n${expoTimingFunctions}\n\n${transitions[transitionStyle].css}\n`;
          const cssFileAbsPath = path.isAbsolute(globalsCssPath) ? globalsCssPath : path.join(cwd, globalsCssPath);
          await fs.ensureDir(path.dirname(cssFileAbsPath));
          await fs.appendFile(cssFileAbsPath, cssBlock);
          createdFiles.push(`✓ Appended transitions CSS to ${chalk.cyan(path.relative(cwd, cssFileAbsPath))}`);
        } else {
          const standaloneCssPath = path.join(componentsPath, 'theme-transitions.css');
          const cssBlock = `/* nthemes: theme toggle transitions */\n${expoTimingFunctions}\n\n${transitions[transitionStyle].css}\n`;
          await fs.writeFile(standaloneCssPath, cssBlock);
          createdFiles.push(`✓ ${chalk.cyan(path.relative(cwd, standaloneCssPath))}`);
        }
      }
    }

    // Generate Provider
    if (components.includes('Provider')) {
      const providerDir = path.dirname(componentsPath);
      await fs.ensureDir(providerDir);
      const providerPath = path.join(providerDir, `Provider.${ext}`);
      
      const themeProviderFilePath = path.join(componentsPath, 'ThemeProvider');
      const relativeImportPath = path.relative(providerDir, themeProviderFilePath)
        .replace(/\\/g, '/');
      const importPath = relativeImportPath.startsWith('.') 
        ? relativeImportPath 
        : './' + relativeImportPath;

      const providerContent = getProviderTemplate(useTypeScript, importPath);
      await fs.writeFile(providerPath, providerContent);
      createdFiles.push(`✓ ${chalk.cyan(path.relative(cwd, providerPath))}`);
    }

    // Print created files
    createdFiles.forEach((file) => {
      console.log(file);
    });
  } catch (error) {
    throw new Error(`Failed to create files: ${error.message}`);
  }
}

module.exports = {
  generateThemeFiles,
};

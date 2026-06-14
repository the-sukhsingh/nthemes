const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { getThemeProviderTemplate, getThemeToggleTemplate, getProviderTemplate } = require('./templates');

async function generateThemeFiles(componentsPath, useTypeScript, components) {
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
      const themeToggleContent = getThemeToggleTemplate(useTypeScript);
      await fs.writeFile(themeTogglePath, themeToggleContent);
      createdFiles.push(`✓ ${chalk.cyan(path.relative(cwd, themeTogglePath))}`);
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

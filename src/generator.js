const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { getThemeProviderTemplate, getThemeToggleTemplate } = require('./templates');

async function generateThemeFiles(componentsPath, useTypeScript, components) {
  // Ensure the components directory exists
  await fs.ensureDir(componentsPath);

  const ext = useTypeScript ? 'tsx' : 'jsx';
  const createdFiles = [];

  try {
    // Generate ThemeProvider
    if (components.includes('ThemeProvider')) {
      const themeProviderPath = path.join(componentsPath, `ThemeProvider.${ext}`);
      const themeProviderContent = getThemeProviderTemplate(useTypeScript);
      await fs.writeFile(themeProviderPath, themeProviderContent);
      createdFiles.push(`✓ ${chalk.cyan('ThemeProvider.' + ext)}`);
    }

    // Generate ThemeToggle
    if (components.includes('ThemeToggle')) {
      const themeTogglePath = path.join(componentsPath, `ThemeToggle.${ext}`);
      const themeToggleContent = getThemeToggleTemplate();
      await fs.writeFile(themeTogglePath, themeToggleContent);
      createdFiles.push(`✓ ${chalk.cyan('ThemeToggle.' + ext)}`);
    }

    // Print created files
    createdFiles.forEach((file) => {
      console.log(file);
    });

    console.log(chalk.gray(`\nFiles created in: ${chalk.cyan(componentsPath)}`));
  } catch (error) {
    throw new Error(`Failed to create files: ${error.message}`);
  }
}

module.exports = {
  generateThemeFiles,
};

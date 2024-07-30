const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Step 1: Install dependencies
console.log('Installing dependencies...');
execSync('npm install -D tailwindcss', { stdio: 'inherit' });
execSync('npx tailwindcss init', { stdio: 'inherit' });

// Step 2: Update tailwind.config.js
const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./templates/**/*.{html,js}", "static/scripts/*.{html,js}"],
  darkMode: 'selector',
  theme: {
    extend: {
      screens: {
        'xs': '350px',
      },
      colors: {
        'primary': {
          '50': '#f3f1ff',
          '100': '#ebe5ff',
          '200': '#d9ceff',
          '300': '#bea6ff',
          '400': '#9f75ff',
          '500': '#843dff',
          '600': '#7916ff',
          '700': '#6b04fd',
          '800': '#5a03d5',
          '900': '#4b05ad',
          '950': '#2c0076',
        },
      },
      fontFamily: {
        'open-sans': 'Open Sans, sans-serif',
      },
    },
  },
  plugins: [],
}`;
fs.writeFileSync('tailwind.config.js', tailwindConfigContent);

// Step 3: Create static folder and input.css
const staticDir = path.join(__dirname, 'static');
const stylesheetsDir = path.join(staticDir, 'stylesheets');
const inputCssContent = `@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *::-webkit-scrollbar {
    @apply w-1;
  }

  *::-webkit-scrollbar-track {
    @apply bg-primary-100;
  }

  *::-webkit-scrollbar-thumb {
    @apply bg-primary-400 rounded-full;
  }

  *::-webkit-scrollbar-thumb:hover {
    @apply bg-primary-600
  }

  *::-webkit-scrollbar-button {
    @apply hidden;
  }
  
  *::-moz-scrollbar {
    @apply w-1;
  }

  *::-moz-scrollbar-track {
    @apply bg-primary-100;
  }

  *::-moz-scrollbar-thumb {
    @apply bg-primary-400 rounded-full;
  }

  *::-moz-scrollbar-thumb:hover {
    @apply bg-primary-600
  }

  *::-moz-scrollbar-button {
    @apply hidden;
  }

*::selection {
    @apply bg-primary-500 text-white;
  }

  *::-moz-selection {
    @apply bg-primary-500 text-white;
  }
}

@layer components{

}

@layer utilities{

}`;

fs.mkdirSync(staticDir, { recursive: true });
fs.mkdirSync(stylesheetsDir, { recursive: true });
fs.writeFileSync(path.join(stylesheetsDir, 'input.css'), inputCssContent);

// Step 4: Update package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts = {
  ...packageJson.scripts,
  build: 'npx tailwindcss -i ./static/stylesheets/input.css -o ./static/stylesheets/output.css --watch',
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// Step 5: Create templates folder and index.html
const templatesDir = path.join(__dirname, 'templates');
const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.css"  rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <script src="https://cdn.lordicon.com/lordicon.js"></script>
    <link rel="stylesheet" href="../static/stylesheets/output.css">
    <title>Home</title>
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js"></script>
</body>
</html>`;

fs.mkdirSync(templatesDir, { recursive: true });
fs.writeFileSync(path.join(templatesDir, 'index.html'), indexHtmlContent);

console.log('Setup complete. You can now run `npm run build` to start Tailwind CSS build process.');

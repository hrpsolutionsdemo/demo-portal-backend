const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Simple Build Process ===');
console.log('Current working directory:', process.cwd());

// Check if TypeScript is available
try {
  console.log('Checking TypeScript installation...');
  execSync('npx tsc --version', { stdio: 'inherit' });
} catch (error) {
  console.log('TypeScript not available, installing...');
  execSync('npm install -g typescript', { stdio: 'inherit' });
}

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  console.log('Creating build directory...');
  fs.mkdirSync(buildDir, { recursive: true });
}

console.log('Compiling TypeScript project...');
execSync('npx tsc -p tsconfig.json', { stdio: 'inherit' });

console.log('=== Build Complete ===');
console.log('Build directory contents:');
if (fs.existsSync(buildDir)) {
  const buildFiles = fs.readdirSync(buildDir, { recursive: true });
  buildFiles.forEach(file => {
    console.log(`  ${file}`);
  });
} else {
  console.log('Build directory not found!');
} 
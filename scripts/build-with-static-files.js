#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting build process with static file copying...');

try {
  // Step 1: Run Next.js build
  console.log('📦 Running Next.js build...');
  execSync('npx next build', { stdio: 'inherit' });

  // Step 2: Copy static files from public to out directory
  console.log('📁 Copying static files...');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const outDir = path.join(__dirname, '..', 'out');
  
  // Ensure out directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  // Copy static files (excluding 5glabx directory which is already handled)
  const staticFiles = ['favicon.ico', 'site.webmanifest', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'og-image.png'];
  
  staticFiles.forEach(file => {
    const srcPath = path.join(publicDir, file);
    const destPath = path.join(outDir, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${file}`);
    } else {
      console.log(`⚠️  ${file} not found in public directory`);
    }
  });
  
  // Step 3: Verify 5GLabX platform files
  console.log('🔍 Verifying 5GLabX platform files...');
  const fiveglabxDir = path.join(outDir, '5glabx');
  if (fs.existsSync(fiveglabxDir)) {
    const files = fs.readdirSync(fiveglabxDir);
    console.log(`✅ 5GLabX platform files found: ${files.join(', ')}`);
  } else {
    console.log('❌ 5GLabX platform directory not found');
  }
  
  console.log('🎉 Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
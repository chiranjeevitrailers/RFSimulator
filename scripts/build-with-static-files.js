#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting build process with static file copying...');

try {
  // Step 1: Run Next.js build
  console.log('📦 Running Next.js build...');
  execSync('npx next build', { stdio: 'inherit' });

  // Step 2: Copy static files from public to .next directory (for Netlify)
  console.log('📁 Copying static files...');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const nextDir = path.join(__dirname, '..', '.next');
  
  // Copy static files to .next directory for Netlify
  const staticFiles = ['favicon.ico', 'site.webmanifest', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'og-image.png'];
  
  staticFiles.forEach(file => {
    const srcPath = path.join(publicDir, file);
    const destPath = path.join(nextDir, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${file}`);
    } else {
      console.log(`⚠️  ${file} not found in public directory`);
    }
  });
  
  // Step 3: Verify build output
  console.log('🔍 Verifying build output...');
  if (fs.existsSync(nextDir)) {
    console.log('✅ Next.js build output found');
  } else {
    console.log('❌ Next.js build output not found');
  }
  
  console.log('🎉 Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
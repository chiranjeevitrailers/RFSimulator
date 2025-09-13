#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting build process with static file copying...');

try {
  // Step 1: Run Next.js build
  console.log('📦 Running Next.js build...');
  execSync('npx next build', { stdio: 'inherit' });

  // Step 2: Copy entire public directory to out directory (ensures favicons, manifest, and 5glabx assets)
  console.log('📁 Copying public directory...');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const outDir = path.join(__dirname, '..', 'out');
  
  // Ensure out directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  if (fs.existsSync(publicDir)) {
    // Node 16+: use fs.cpSync if available
    if (typeof fs.cpSync === 'function') {
      fs.cpSync(publicDir, outDir, { recursive: true, force: true });
    } else {
      // Fallback recursive copy
      const copyRecursive = (src, dest) => {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src)) {
          const srcPath = path.join(src, entry);
          const destPath = path.join(dest, entry);
          const stat = fs.statSync(srcPath);
          if (stat.isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };
      copyRecursive(publicDir, outDir);
    }
    console.log('✅ Copied public directory');
  } else {
    console.log('⚠️  public directory not found');
  }
  
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
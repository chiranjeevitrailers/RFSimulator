#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files to update
const filesToUpdate = [
  'components/5glabx/views/RlcLayerViewTSX.tsx',
  'components/5glabx/views/PdcpLayerViewTSX.tsx',
  'components/5glabx/views/NasLayerViewTSX.tsx',
  'components/5glabx/views/RrcLayerViewTSX.tsx'
];

// Mock data patterns to remove
const mockDataPatterns = [
  // Math.random() patterns
  /Math\.floor\(Math\.random\(\) \* \d+\)/g,
  /Math\.random\(\) \* \d+/g,
  /Math\.random\(\) > 0\.5/g,
  /95 \+ Math\.random\(\) \* 5/g,
  /80 \+ Math\.random\(\) \* 15/g,
  /100 \+ Math\.random\(\) \* 50/g,
  /50 \+ Math\.random\(\) \* 25/g,
  /2 \+ Math\.random\(\) \* 2/g,
  /75 \+ Math\.random\(\) \* 35/g,
  /0\.5 \+ Math\.random\(\) \* 2/g,
  /1 \+ Math\.random\(\) \* 3/g,
  /10 \+ Math\.random\(\) \* 20/g,
  /90 \+ Math\.random\(\) \* 10/g,
  /-85 \+ Math\.random\(\) \* 10/g,
  /-10 \+ Math\.random\(\) \* 5/g,
  /-80 \+ Math\.random\(\) \* 10/g,
  /5 \+ Math\.floor\(Math\.random\(\) \* 3\)/g,
  /1 \+ Math\.floor\(Math\.random\(\) \* 2\)/g,
  /2 \+ Math\.floor\(Math\.random\(\) \* 3\)/g,
  /Math\.floor\(Math\.random\(\) \* 1\)/g,
  /Math\.floor\(Math\.random\(\) \* 3\)/g,
  /Math\.floor\(Math\.random\(\) \* 2\)/g,
  /Math\.floor\(Math\.random\(\) \* 5\)/g,
  /Math\.floor\(Math\.random\(\) \* 10\)/g,
  /Math\.floor\(Math\.random\(\) \* 1000\)/g,
  /Math\.floor\(Math\.random\(\) \* 500\)/g,
  /Math\.floor\(Math\.random\(\) \* 300\)/g,
  /Math\.floor\(Math\.random\(\) \* 2048\)/g,
  /Math\.floor\(Math\.random\(\) \* 1024\)/g,
  /Math\.floor\(Math\.random\(\) \* 4095\)/g,
  /Math\.floor\(Math\.random\(\) \* 4\)/g,
  
  // Hardcoded values that should be 0 or calculated
  /125\.5/g,
  /98\.3/g,
  /156\.7/g,
  /85\.2/g,
  /98\.5/g,
  /2\.5/g
];

function removeMockData(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove mock data patterns
    mockDataPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`Found mock data in ${filePath}:`, matches);
        // Replace with 0 or appropriate default
        content = content.replace(pattern, '0');
        modified = true;
      }
    });
    
    // Replace specific hardcoded values with 0
    content = content.replace(/125\.5/g, '0');
    content = content.replace(/98\.3/g, '0');
    content = content.replace(/156\.7/g, '0');
    content = content.replace(/85\.2/g, '0');
    content = content.replace(/98\.5/g, '0');
    content = content.replace(/2\.5/g, '0');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`ℹ️  No mock data found in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all files
console.log('🧹 Removing mock data from protocol layer views...\n');

filesToUpdate.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    removeMockData(fullPath);
  } else {
    console.log(`⚠️  File not found: ${fullPath}`);
  }
});

console.log('\n✅ Mock data removal complete!');
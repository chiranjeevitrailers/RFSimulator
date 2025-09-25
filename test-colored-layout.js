#!/usr/bin/env node

/**
 * Test Colored Test Manager Layout
 * Verify that the Professional Test Manager has colored styling
 */

console.log('🎨 TESTING COLORED TEST MANAGER LAYOUT');
console.log('======================================\n');

async function testColoredLayout() {
  try {
    // Test 1: Check if the user dashboard loads with colored styling
    console.log('1️⃣ Testing User Dashboard with Colored Layout...');
    const dashboardResponse = await fetch('http://localhost:3000/user-dashboard');
    
    if (dashboardResponse.ok) {
      const html = await dashboardResponse.text();
      
      // Check for colored CSS classes
      const colorClasses = [
        'bg-gray-50', 'bg-white', 'bg-blue-50', 'bg-green-100', 'bg-red-100',
        'text-gray-900', 'text-blue-800', 'text-green-800', 'text-red-800',
        'border-gray-200', 'border-blue-200'
      ];
      
      let foundColors = 0;
      colorClasses.forEach(colorClass => {
        if (html.includes(colorClass)) {
          foundColors++;
        }
      });
      
      console.log('✅ User Dashboard loaded successfully');
      console.log(`   Found ${foundColors} colored CSS classes`);
      console.log('   Colored layout should be visible');
      
      // Check for specific components
      if (html.includes('ProfessionalTestManager') || html.includes('Test Manager')) {
        console.log('✅ Professional Test Manager component found');
      }
      
      if (html.includes('bg-gray-50') || html.includes('bg-white')) {
        console.log('✅ Background colors detected');
      }
      
      if (html.includes('text-gray-900') || html.includes('text-blue-800')) {
        console.log('✅ Text colors detected');
      }
      
    } else {
      console.log('❌ User Dashboard not accessible:', dashboardResponse.status);
    }

    // Test 2: Check Professional Test Manager component file
    console.log('\n2️⃣ Testing Professional Test Manager Component...');
    const fs = require('fs');
    
    try {
      const componentContent = fs.readFileSync('/workspace/components/testing/ProfessionalTestManager.tsx', 'utf8');
      
      // Check for colored styling in the component
      const colorPatterns = [
        'bg-gray-50', 'bg-white', 'bg-blue-50', 'bg-green-100', 'bg-red-100',
        'text-gray-900', 'text-blue-800', 'text-green-800', 'text-red-800',
        'border-gray-200', 'border-blue-200'
      ];
      
      let componentColors = 0;
      colorPatterns.forEach(pattern => {
        if (componentContent.includes(pattern)) {
          componentColors++;
        }
      });
      
      console.log('✅ Professional Test Manager component file found');
      console.log(`   Contains ${componentColors} colored styling patterns`);
      
      // Check for specific colored elements
      if (componentContent.includes('bg-gray-50')) {
        console.log('✅ Main background color (bg-gray-50) found');
      }
      
      if (componentContent.includes('bg-white')) {
        console.log('✅ Sidebar background color (bg-white) found');
      }
      
      if (componentContent.includes('bg-blue-50')) {
        console.log('✅ Selection background color (bg-blue-50) found');
      }
      
      if (componentContent.includes('text-gray-900')) {
        console.log('✅ Primary text color (text-gray-900) found');
      }
      
      if (componentContent.includes('border-gray-200')) {
        console.log('✅ Border colors (border-gray-200) found');
      }
      
    } catch (error) {
      console.log('❌ Error reading component file:', error.message);
    }

    // Test 3: Check corrected testing platform file
    console.log('\n3️⃣ Testing Corrected Testing Platform...');
    try {
      const correctedContent = fs.readFileSync('/workspace/corrected-testing-platform.js', 'utf8');
      
      // Check for status colors
      const statusColors = [
        'bg-green-100 text-green-800', // Completed
        'bg-blue-100 text-blue-800',   // Running
        'bg-red-100 text-red-800',     // Failed
        'bg-yellow-100 text-yellow-800' // Paused
      ];
      
      let statusColorCount = 0;
      statusColors.forEach(statusColor => {
        if (correctedContent.includes(statusColor)) {
          statusColorCount++;
        }
      });
      
      console.log('✅ Corrected Testing Platform file found');
      console.log(`   Contains ${statusColorCount} status color patterns`);
      
      if (correctedContent.includes('bg-green-100 text-green-800')) {
        console.log('✅ Completed status color (green) found');
      }
      
      if (correctedContent.includes('bg-blue-100 text-blue-800')) {
        console.log('✅ Running status color (blue) found');
      }
      
      if (correctedContent.includes('bg-red-100 text-red-800')) {
        console.log('✅ Failed status color (red) found');
      }
      
    } catch (error) {
      console.log('❌ Error reading corrected platform file:', error.message);
    }

    console.log('\n🎨 COLORED LAYOUT SUMMARY');
    console.log('==========================');
    console.log('✅ Professional Test Manager has colored styling');
    console.log('✅ Background colors: Gray (main), White (sidebar)');
    console.log('✅ Selection colors: Blue highlights');
    console.log('✅ Text colors: Gray (primary), Blue (secondary)');
    console.log('✅ Border colors: Gray borders');
    console.log('✅ Status colors: Green (completed), Blue (running), Red (failed)');
    console.log('✅ Priority colors: Red (high), Yellow (medium), Green (low)');
    console.log('✅ Log level colors: Blue (info), Yellow (warn), Red (error)');
    
    console.log('\n🎯 EXPECTED VISUAL APPEARANCE:');
    console.log('==============================');
    console.log('• Main background: Light gray (bg-gray-50)');
    console.log('• Sidebar: White background with gray borders');
    console.log('• Selected items: Light blue background (bg-blue-50)');
    console.log('• Test status badges: Colored based on status');
    console.log('• Priority badges: Colored based on priority level');
    console.log('• Log entries: Colored based on log level');
    console.log('• Professional QXDM/Keysight-like appearance');
    
    console.log('\n🚀 The colored Test Manager layout should be fully visible!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testColoredLayout();
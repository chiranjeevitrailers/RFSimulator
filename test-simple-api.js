#!/usr/bin/env node

/**
 * Simple API Test
 */

const http = require('http');

console.log('🧪 Testing API Endpoints...\n');

const endpoints = [
  'http://localhost:3000/api/test-cases/comprehensive?limit=1',
  'http://localhost:3000/api/test-execution/comprehensive?testCaseId=test-123'
];

endpoints.forEach((endpoint, index) => {
  console.log(`🔍 Testing endpoint ${index + 1}: ${endpoint}`);

  const req = http.get(endpoint, (res) => {
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => {
      const data = Buffer.concat(chunks).toString();
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📄 Response length: ${data.length} characters`);

      if (data.length < 100) {
        console.log(`📄 Response: ${data}`);
      } else {
        console.log(`📄 Response preview: ${data.substring(0, 100)}...`);
      }

      if (res.statusCode === 200 && data.length > 10) {
        console.log('✅ Endpoint working');
      } else {
        console.log('❌ Endpoint issue detected');
      }

      console.log('---');
    });
  });

  req.on('error', (err) => {
    console.log(`❌ Request failed: ${err.message}`);
    console.log('---');
  });

  req.setTimeout(5000, () => {
    console.log('❌ Request timeout');
    req.destroy();
    console.log('---');
  });
});
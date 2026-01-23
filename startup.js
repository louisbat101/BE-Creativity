#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Startup Diagnostics:');
console.log('========================');
console.log('📂 Working Directory:', process.cwd());
console.log('📂 Script Directory:', __dirname);
console.log('📊 Node Version:', process.version);
console.log('🔧 NPM Version:', process.env.npm_version || 'unknown');
console.log('🌍 NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('');

// Check for required directories
const checks = [
  { name: 'Root package.json', path: 'package.json' },
  { name: 'Frontend package.json', path: 'frontend/package.json' },
  { name: 'Backend package.json', path: 'backend/package.json' },
  { name: 'Frontend build', path: 'frontend/build' },
  { name: 'Frontend build index.html', path: 'frontend/build/index.html' },
  { name: 'Root node_modules', path: 'node_modules' },
  { name: 'Frontend node_modules', path: 'frontend/node_modules' },
  { name: 'Backend node_modules', path: 'backend/node_modules' },
];

console.log('✓ Checking Resources:');
checks.forEach(check => {
  const fullPath = path.join(__dirname, check.path);
  const exists = fs.existsSync(fullPath);
  const symbol = exists ? '✅' : '❌';
  console.log(`${symbol} ${check.name}: ${check.path}`);
});

console.log('');
console.log('🚀 Ready to start server.js');

#!/usr/bin/env node
/**
 * Setup Verification Script
 * Verifies that all required environment variables and dependencies are configured
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('\n🔍 ManaraScholars Backend - Setup Verification\n');
console.log('=' .repeat(60));

let hasErrors = false;
let hasWarnings = false;

// Check environment variables
console.log('\n📋 Environment Variables Check:');
console.log('-'.repeat(60));

const requiredVars = [
  { key: 'BREVO_API_KEY', name: 'Brevo API Key', critical: true },
  { key: 'FROM_EMAIL', name: 'From Email', critical: true },
  { key: 'ADMIN_EMAIL', name: 'Admin Email', critical: true },
  { key: 'MONGODB_URI', name: 'MongoDB URI', critical: true },
];

const optionalVars = [
  { key: 'PORT', name: 'Port', default: '5000' },
  { key: 'NODE_ENV', name: 'Node Environment', default: 'development' },
  { key: 'FRONTEND_URL', name: 'Frontend URL', default: 'http://localhost:3000' },
  { key: 'RATE_LIMIT_WINDOW_MS', name: 'Rate Limit Window', default: '900000' },
  { key: 'RATE_LIMIT_MAX_REQUESTS', name: 'Rate Limit Max Requests', default: '100' },
];

// Check required variables
requiredVars.forEach(({ key, name, critical }) => {
  const value = process.env[key];
  if (!value || value.includes('your_') || value.includes('example') || value.trim() === '') {
    console.log(`❌ ${name}: NOT SET or using placeholder`);
    if (critical) hasErrors = true;
  } else if (value === 'your_brevo_api_key_here') {
    console.log(`⚠️  ${name}: Using placeholder - needs to be updated`);
    hasWarnings = true;
  } else {
    const displayValue = key === 'BREVO_API_KEY' || key === 'MONGODB_URI' 
      ? `${value.substring(0, 20)}...` 
      : value;
    console.log(`✅ ${name}: ${displayValue}`);
  }
});

// Check optional variables
optionalVars.forEach(({ key, name, default: defaultValue }) => {
  const value = process.env[key] || defaultValue;
  console.log(`✓  ${name}: ${value}`);
});

// Check dependencies
console.log('\n📦 Dependencies Check:');
console.log('-'.repeat(60));

const requiredPackages = [
  '@getbrevo/brevo',
  'express',
  'mongoose',
  'dotenv',
  'express-validator',
  'express-rate-limit',
  'helmet',
];

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

requiredPackages.forEach(pkg => {
  try {
    require.resolve(pkg);
    console.log(`✅ ${pkg}: Installed`);
  } catch (e) {
    console.log(`❌ ${pkg}: NOT INSTALLED`);
    hasErrors = true;
  }
});

// Check .env file exists
console.log('\n📄 Configuration Files:');
console.log('-'.repeat(60));

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file: Exists');
} else {
  console.log('❌ .env file: NOT FOUND');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Verification Summary:');

if (hasErrors) {
  console.log('\n❌ ERRORS FOUND: Please fix the issues above before starting the server.');
  console.log('\n📝 Next Steps:');
  console.log('   1. Update BREVO_API_KEY in .env with your actual Brevo API key');
  console.log('   2. Update FROM_EMAIL with a verified sender email in Brevo');
  console.log('   3. Update ADMIN_EMAIL with your admin email address');
  console.log('   4. Update MONGODB_URI with your MongoDB connection string');
  console.log('   5. Run: npm install (if dependencies are missing)');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  WARNINGS: Configuration needs to be updated.');
  console.log('\n📝 Next Steps:');
  console.log('   1. Get your Brevo API key from https://www.brevo.com/');
  console.log('   2. Verify your sender email in Brevo dashboard');
  console.log('   3. Update the placeholder values in .env file');
  console.log('\n✅ You can still start the server, but emails will not work until BREVO_API_KEY is set.');
} else {
  console.log('\n✅ ALL CHECKS PASSED!');
  console.log('\n🚀 You can start the server with:');
  console.log('   npm run dev  (development mode)');
  console.log('   npm start    (production mode)');
}

console.log('\n' + '='.repeat(60) + '\n');


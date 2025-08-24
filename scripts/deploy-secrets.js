#!/usr/bin/env node

/**
 * Script to upload secrets to Vercel environment variables
 * Run this locally to configure your production environment
 * Usage: node scripts/deploy-secrets.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function deploySecrets() {
  console.log('🚀 Deploying secrets to Vercel...');
  
  // Check if .env.production exists
  const envPath = path.join(__dirname, '..', '.env.production');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.production file not found. Please create it first.');
    console.log('Expected location:', envPath);
    return;
  }

  // Read environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const [key, ...valueParts] = line.split('=');
      return { key: key.trim(), value: valueParts.join('=').trim() };
    });

  console.log(`📋 Found ${envVars.length} environment variables to deploy:`);
  envVars.forEach(({ key }) => console.log(`  - ${key}`));

  // Deploy each environment variable
  for (const { key, value } of envVars) {
    try {
      console.log(`📤 Deploying ${key}...`);
      execSync(`vercel env add ${key} production`, {
        input: value,
        stdio: ['pipe', 'inherit', 'inherit']
      });
      console.log(`✅ ${key} deployed successfully`);
    } catch (error) {
      console.error(`❌ Failed to deploy ${key}:`, error.message);
    }
  }

  console.log('🎉 Secret deployment completed!');
  console.log('💡 Remember to run "vercel --prod" to deploy your application');
}

if (require.main === module) {
  deploySecrets();
}

module.exports = { deploySecrets };
#!/usr/bin/env node
 
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
 
const VIBESHARING_URL = process.env.VIBESHARING_URL || 'https://vibesharing.app';
const GLOBAL_CONFIG_PATH = path.join(os.homedir(), '.vibesharing', 'config.json');
 
const EXCLUDE_PATTERNS = [
  'node_modules/*', '.git/*', '.next/*', '.vercel/*', '__MACOSX/*',
  '.DS_Store', 'Thumbs.db', '.env', '.env.local', '*.log', 'deploy.zip'
];
 
function loadGlobalConfig() {
  if (fs.existsSync(GLOBAL_CONFIG_PATH)) {
    try { return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, 'utf-8')); } catch (e) {}
  }
  return {};
}
 
function main() {
  console.log('\n🚀 VibeSharing Deploy\n');
 
  const globalConfig = loadGlobalConfig();
  if (globalConfig.deployToken) console.log('✓ Found global config (~/.vibesharing/config.json)');
 
  let projectConfig = {};
  const configPath = path.join(process.cwd(), 'vibesharing.json');
  if (fs.existsSync(configPath)) {
    try {
      projectConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      console.log('✓ Found vibesharing.json');
    } catch (e) {
      console.error('✗ Error reading vibesharing.json:', e.message);
      process.exit(1);
    }
  }
 
  const prototypeId = projectConfig.prototypeId || process.env.VIBESHARING_PROTOTYPE_ID;
  if (!prototypeId) {
    console.error('\n✗ No prototype ID found!');
    console.error('\nCreate vibesharing.json with: { "prototypeId": "your-id-here" }');
    console.error('Get the ID from your prototype page on vibesharing.app');
    process.exit(1);
  }
 
  const deployToken = projectConfig.deployToken || globalConfig.deployToken || process.env.VIBESHARING_DEPLOY_TOKEN;
  if (!deployToken) {
    console.error('\n✗ No deploy token found!');
    console.error('\nOption 1: Save globally (recommended):');
    console.error('  mkdir -p ~/.vibesharing');
    console.error('  echo \'{"deployToken": "vs_xxx"}\' > ~/.vibesharing/config.json');
    console.error('\nOption 2: Add to vibesharing.json:');
    console.error('  { "prototypeId": "...", "deployToken": "vs_xxx" }');
    console.error('\nGet your token at vibesharing.app/dashboard/account');
    process.exit(1);
  }
 
  let projectName = path.basename(process.cwd());
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgPath)) {
    try { projectName = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).name || projectName; } catch (e) {}
  }
 
  console.log(`✓ Prototype ID: ${prototypeId.substring(0, 8)}...`);
  console.log(`✓ Deploy token: ${deployToken.substring(0, 8)}...`);
  console.log(`✓ Project: ${projectName}`);
 
  console.log('\n📦 Creating deployment package...');
  const zipPath = path.join(process.cwd(), 'deploy.zip');
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
 
  try {
    execSync(`zip -r deploy.zip . ${EXCLUDE_PATTERNS.map(p => `-x "${p}"`).join(' ')}`, { cwd: process.cwd(), stdio: 'pipe' });
    const sizeMB = (fs.statSync(zipPath).size / 1024 / 1024).toFixed(2);
    console.log(`✓ Created deploy.zip (${sizeMB} MB)`);
    if (parseFloat(sizeMB) > 8) {
      console.error('\n⚠️  Warning: ZIP is large (>8MB). Deployment may fail.');
    }
  } catch (e) {
    console.error('✗ Failed to create zip. Make sure "zip" is installed.');
    process.exit(1);
  }
 
  console.log('\n☁️  Uploading to VibeSharing...');
 
  try {
    const curlCmd = `curl -sL -w "\\n---HTTP_CODE:%{http_code}---" -X POST "${VIBESHARING_URL}/api/deploy/zip" \
      -H "Authorization: Bearer ${deployToken}" \
      -F "file=@deploy.zip" \
      -F "prototypeId=${prototypeId}" \
      -F "projectName=${projectName}"`;
    const rawResponse = execSync(curlCmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    fs.unlinkSync(zipPath);
 
    const httpCodeMatch = rawResponse.match(/---HTTP_CODE:(\d+)---$/);
    const httpCode = httpCodeMatch ? parseInt(httpCodeMatch[1]) : 0;
    const response = rawResponse.replace(/\n---HTTP_CODE:\d+---$/, '').trim();
 
    console.log(`   HTTP Status: ${httpCode}`);
 
    if (!response) {
      console.error('\n✗ Empty response from server');
      if (httpCode === 401) console.error('Invalid deploy token. Check vibesharing.app/dashboard/account');
      else if (httpCode === 413) console.error('File too large. Reduce project size.');
      else if (httpCode >= 500) console.error('Server error. Try again later.');
      else console.error('Check your internet connection.');
      process.exit(1);
    }
 
    let result;
    try {
      result = JSON.parse(response);
    } catch (e) {
      console.error('\n✗ Unexpected response from server');
      console.error('Response preview:', response.substring(0, 300));
      if (response.includes('<!DOCTYPE') || response.includes('<html')) {
        console.error('\n⚠️  Server returned HTML. Possible causes:');
        console.error('- Invalid deploy token');
        console.error('- Server misconfiguration');
      }
      process.exit(1);
    }
 
    if (result.error) {
      console.error('\n✗ Deployment failed:', result.error);
      process.exit(1);
    }
 
    console.log('\n✅ Deployed successfully!\n');
    console.log(`🔗 Live URL: ${result.deployedUrl}`);
    if (result.contextImported) console.log('📝 CLAUDE.md imported as context');
    console.log(`\n📊 View on VibeSharing:`);
    console.log(`   ${VIBESHARING_URL}/dashboard/projects/${prototypeId}\n`);
 
  } catch (e) {
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    console.error('\n✗ Deployment failed:', e.message);
    process.exit(1);
  }
}
 
main();
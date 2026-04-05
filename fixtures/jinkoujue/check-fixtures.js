#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const fixtureDir = path.join(__dirname);
const files = fs.readdirSync(fixtureDir).filter((file) => file.endsWith('.json'));

console.log(`Loaded ${files.length} JinKouJue fixtures:`);
for (const file of files) {
  const fullPath = path.join(fixtureDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  console.log(`- ${data.id}`);
  console.log(`  input: ${data.input.solar}, 地分${data.input.difen}, 贵人=${data.input.gui_mode}, 换将=${data.input.jiang_mode}`);
  console.log(`  expected: ${Object.entries(data.expected).map(([key, value]) => `${key}=${value}`).join('; ')}`);
}

console.log('\nNext step: wire this script to the local JinKouJue calculator and assert actual vs expected.');

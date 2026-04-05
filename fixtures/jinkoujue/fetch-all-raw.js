#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const fixtureDir = __dirname;
const rawDir = path.join(fixtureDir, 'raw');
const fetchScript = path.join(fixtureDir, 'fetch-reference.sh');

for (const file of fs.readdirSync(fixtureDir).filter((name) => name.endsWith('.json'))) {
  const fixture = JSON.parse(fs.readFileSync(path.join(fixtureDir, file), 'utf8'));
  const [datePart, timePart] = fixture.input.solar.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  const outFile = path.join(rawDir, `${fixture.id}.html`);
  execFileSync(fetchScript, [
    year,
    String(Number(month)),
    String(Number(day)),
    String(Number(hour)),
    String(Number(minute)),
    fixture.input.difen,
    fixture.input.gui_mode,
    fixture.input.jiang_mode,
    outFile
  ], { stdio: 'inherit' });
  console.log(`FETCHED ${fixture.id}`);
}

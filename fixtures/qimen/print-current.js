#!/usr/bin/env node

const path = require('path');
const { computeFixture } = require(path.join(__dirname, 'evaluate-current.js'));

const [solar = '2026-04-05 12:35:00', ju = '拆补局'] = process.argv.slice(2);
console.log(JSON.stringify(computeFixture({ solar, ju }), null, 2));

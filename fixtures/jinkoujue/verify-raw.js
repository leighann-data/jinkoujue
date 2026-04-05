#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { computeFixture } = require('./evaluate-current.js');

const rawDir = path.join(__dirname, 'raw');

function parseRaw(html) {
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/td>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const findLine = (prefix) => text.find((line) => line.startsWith(prefix));
  const lineSolar = findLine('公元：');
  const lineMonthGeneral = findLine('月将：');
  const lineGanzhi = findLine('干支：');
  const lineJieqi = text.find((line) => /：\d{4}\/\d+\/\d+/.test(line) && line.includes('：') && !line.startsWith('公元：'));
  const lineShensha = findLine('神煞：');
  const lineRenyuan = findLine('人元：');
  const lineGuishen = findLine('贵神：');
  const lineJiangshen = findLine('将神：');
  const lineDifen = findLine('地分：');
  const lineKong = findLine('▲四大空亡：');
  const lineJishi = findLine('▲忌时：');
  const lineWudong = findLine('▲五动：');
  const lineSandong = findLine('▲三动：');

  if (!lineSolar || !lineMonthGeneral || !lineGanzhi || !lineJieqi || !lineShensha || !lineRenyuan || !lineGuishen || !lineJiangshen || !lineDifen || !lineKong || !lineJishi || !lineWudong || !lineSandong) {
    throw new Error('Unable to locate required lines');
  }

  const solarMatch = lineSolar.match(/公元：(\d+)年(\d+)月(\d+)日(\d+)时(\d+)分/);
  const monthGeneralMatch = lineMonthGeneral.match(/月将：(.)将（按(节气|中气)取）/);
  const ganzhiMatch = lineGanzhi.match(/干支：(..)年 (..)月 (..)日 (..)时/);
  const jieqiMatch = lineJieqi.match(/([^：]+)：([0-9/: ]+) ([^：]+)：([0-9/: ]+)/);
  const renyuanMatch = lineRenyuan.match(/人元：(.+) (.)$/);
  const guishenMatch = lineGuishen.match(/贵神：(..)（([^）]+)） ?(☉)?(.)$/);
  const jiangshenMatch = lineJiangshen.match(/将神：(..)（([^）]+)） ?(☉)?(.)$/);
  const difenMatch = lineDifen.match(/地分：(.+) (.)$/);
  const kongMatch = lineKong.match(/▲四大空亡：([^ ]+) 日空：(..)/);

  if (!solarMatch || !monthGeneralMatch || !ganzhiMatch || !jieqiMatch || !renyuanMatch || !guishenMatch || !jiangshenMatch || !difenMatch || !kongMatch) {
    throw new Error('Unable to parse required line fields');
  }

  const [, year, month, day, hour, minute] = solarMatch;
  const [, yuejiang, jiangModeLabel] = monthGeneralMatch;
  const [, yearPillar, monthPillar, dayPillar, hourPillar] = ganzhiMatch;
  const [, prevJieLabel, , nextJieLabel] = jieqiMatch;
  const [, renyuan, renyuanElement] = renyuanMatch;
  const [, guishenGanzhi, guishenName, guishenYong, guishenElement] = guishenMatch;
  const [, jiangshenGanzhi, jiangshenName, jiangshenYong, jiangshenElement] = jiangshenMatch;
  const [, difen, difenElement] = difenMatch;
  const [, sidakongwang, rikongRaw] = kongMatch;

  const normalizeList = (text) => text.replace(/\./g, ' · ').replace(/\s+/g, ' ').trim();
  const normalizeDong = (text) => {
    const value = text.trim().replace(/\s+/g, '、');
    return value || '无';
  };

  return {
    solar: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`,
    jiepair: `${prevJieLabel}/${nextJieLabel}`,
    yuejiang,
    jiang_mode_label: jiangModeLabel,
    ganzhi: `${yearPillar}年 ${monthPillar}月 ${dayPillar}日 ${hourPillar}时`,
    shensha: normalizeList(lineShensha.replace('神煞：', '')),
    renyuan: renyuan.trim(),
    renyuan_element: renyuanElement,
    guishen: `${guishenGanzhi}（${guishenName}）`,
    guishen_element: guishenElement,
    guishen_yong: guishenYong === '☉',
    jiangshen: `${jiangshenGanzhi}（${jiangshenName}）`,
    jiangshen_element: jiangshenElement,
    jiangshen_yong: jiangshenYong === '☉',
    difen: difen.trim(),
    difen_element: difenElement,
    sidakongwang,
    rikong: rikongRaw.replace(/(.)(.)/, '$1、$2'),
    jishi: lineJishi.replace('▲忌时：', '').trim(),
    wudong: normalizeDong(lineWudong.replace('▲五动：', '')),
    sandong: normalizeDong(lineSandong.replace('▲三动：', ''))
  };
}

let failures = 0;
for (const file of fs.readdirSync(__dirname).filter((name) => name.endsWith('.json'))) {
  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
  const rawPath = path.join(rawDir, `${fixture.id}.html`);
  if (!fs.existsSync(rawPath)) {
    console.log(`SKIP ${fixture.id} missing raw`);
    continue;
  }

  const raw = parseRaw(fs.readFileSync(rawPath, 'utf8'));
  const actual = computeFixture(fixture.input);
  const checks = {
    ganzhi: raw.ganzhi,
    jiepair: raw.jiepair,
    yuejiang: raw.yuejiang,
    shensha: raw.shensha,
    renyuan: raw.renyuan,
    renyuan_element: raw.renyuan_element,
    guishen: raw.guishen,
    guishen_element: raw.guishen_element,
    jiangshen: raw.jiangshen,
    jiangshen_element: raw.jiangshen_element,
    difen: raw.difen,
    difen_element: raw.difen_element,
    sidakongwang: raw.sidakongwang,
    rikong: raw.rikong,
    jishi: raw.jishi,
    wudong: raw.wudong,
    sandong: raw.sandong,
    yongshen: raw.guishen_yong ? 'guiShen' : (raw.jiangshen_yong ? 'jiangShen' : actual.yongshen)
  };

  const diffs = [];
  for (const [key, expected] of Object.entries(checks)) {
    if (actual[key] !== expected) {
      diffs.push({ key, expected, actual: actual[key] });
    }
  }

  if (diffs.length) {
    failures += 1;
    console.log(`FAIL ${fixture.id}`);
    for (const diff of diffs) {
      console.log(`  ${diff.key}: expected=${diff.expected} actual=${diff.actual}`);
    }
  } else {
    console.log(`PASS ${fixture.id}`);
  }
}

process.exitCode = failures ? 1 : 0;

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const lunarCode = fs.readFileSync(path.join(__dirname, '..', '..', 'vendor', 'lunar.js'), 'utf8');
const sandbox = { console };
vm.createContext(sandbox);
vm.runInContext(lunarCode, sandbox);
const { Solar } = sandbox;

const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const qimenJuTable = {
  '冬至': { '上元': '阳遁一局', '中元': '阳遁七局', '下元': '阳遁四局' },
  '小寒': { '上元': '阳遁二局', '中元': '阳遁八局', '下元': '阳遁五局' },
  '大寒': { '上元': '阳遁三局', '中元': '阳遁九局', '下元': '阳遁六局' },
  '立春': { '上元': '阳遁八局', '中元': '阳遁五局', '下元': '阳遁二局' },
  '雨水': { '上元': '阳遁九局', '中元': '阳遁六局', '下元': '阳遁三局' },
  '惊蛰': { '上元': '阳遁一局', '中元': '阳遁七局', '下元': '阳遁四局' },
  '春分': { '上元': '阳遁三局', '中元': '阳遁九局', '下元': '阳遁六局' },
  '清明': { '上元': '阳遁四局', '中元': '阳遁一局', '下元': '阳遁七局' },
  '谷雨': { '上元': '阳遁五局', '中元': '阳遁二局', '下元': '阳遁八局' },
  '立夏': { '上元': '阳遁四局', '中元': '阳遁一局', '下元': '阳遁七局' },
  '小满': { '上元': '阳遁五局', '中元': '阳遁二局', '下元': '阳遁八局' },
  '芒种': { '上元': '阳遁六局', '中元': '阳遁三局', '下元': '阳遁九局' },
  '夏至': { '上元': '阴遁九局', '中元': '阴遁三局', '下元': '阴遁六局' },
  '小暑': { '上元': '阴遁八局', '中元': '阴遁二局', '下元': '阴遁五局' },
  '大暑': { '上元': '阴遁七局', '中元': '阴遁一局', '下元': '阴遁四局' },
  '立秋': { '上元': '阴遁二局', '中元': '阴遁五局', '下元': '阴遁八局' },
  '处暑': { '上元': '阴遁一局', '中元': '阴遁四局', '下元': '阴遁七局' },
  '白露': { '上元': '阴遁九局', '中元': '阴遁三局', '下元': '阴遁六局' },
  '秋分': { '上元': '阴遁七局', '中元': '阴遁一局', '下元': '阴遁四局' },
  '寒露': { '上元': '阴遁六局', '中元': '阴遁九局', '下元': '阴遁三局' },
  '霜降': { '上元': '阴遁五局', '中元': '阴遁八局', '下元': '阴遁二局' },
  '立冬': { '上元': '阴遁六局', '中元': '阴遁九局', '下元': '阴遁三局' },
  '小雪': { '上元': '阴遁五局', '中元': '阴遁八局', '下元': '阴遁二局' },
  '大雪': { '上元': '阴遁四局', '中元': '阴遁七局', '下元': '阴遁一局' }
};

function getFuTou(dayGan, dayZhi) {
  let ganIndex = tianGan.indexOf(dayGan);
  let zhiIndex = diZhi.indexOf(dayZhi);
  while (ganIndex !== 0 && ganIndex !== 5) {
    ganIndex = (ganIndex - 1 + 10) % 10;
    zhiIndex = (zhiIndex - 1 + 12) % 12;
  }
  return {
    gan: tianGan[ganIndex],
    zhi: diZhi[zhiIndex],
    ganZhi: tianGan[ganIndex] + diZhi[zhiIndex]
  };
}

function getSanYuan(fuTouZhi) {
  if (['子', '午', '卯', '酉'].includes(fuTouZhi)) return '上元';
  if (['寅', '申', '巳', '亥'].includes(fuTouZhi)) return '中元';
  if (['辰', '戌', '丑', '未'].includes(fuTouZhi)) return '下元';
  return '';
}

function getQimenJu(jieqiName, sanYuan) {
  const jieqi = qimenJuTable[jieqiName];
  if (jieqi && jieqi[sanYuan]) return jieqi[sanYuan];
  return '--';
}

function calculateDiPan(juNumber, isYang) {
  const stems = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
  const palaces = {};
  for (let i = 1; i <= 9; i++) palaces[i] = '';
  for (let i = 0; i < 9; i++) {
    let pos;
    if (isYang) {
      pos = (juNumber + i - 1) % 9 + 1;
    } else {
      pos = (juNumber - i - 1) % 9 + 1;
      if (pos <= 0) pos += 9;
    }
    palaces[pos] = stems[i];
  }
  return palaces;
}

function getDiPanPosition(palaces, stem) {
  for (let i = 1; i <= 9; i++) {
    if (palaces[i] === stem) return i;
  }
  return 1;
}

function calculateLeaders(hourGan, hourZhi, juStr) {
  const ganIndex = tianGan.indexOf(hourGan);
  const zhiIndex = diZhi.indexOf(hourZhi);
  let diff = zhiIndex - ganIndex;
  if (diff < 0) diff += 12;

  const xunShouMap = { 0: '戊', 10: '己', 8: '庚', 6: '辛', 4: '壬', 2: '癸' };
  const xunShouStem = xunShouMap[diff] || '戊';
  const xunShouNames = {
    '戊': '甲子(戊)',
    '己': '甲戌(己)',
    '庚': '甲申(庚)',
    '辛': '甲午(辛)',
    '壬': '甲辰(壬)',
    '癸': '甲寅(癸)'
  };

  const isYang = juStr.startsWith('阳');
  const juNumMap = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
  const juChar = juStr.replace(/[阳阴遁局]/g, '');
  const juNumber = juNumMap[juChar] || 1;
  const palaces = calculateDiPan(juNumber, isYang);
  const startPalace = getDiPanPosition(palaces, xunShouStem);

  const stars = { 1: '天蓬', 2: '天芮', 3: '天冲', 4: '天辅', 5: '天禽', 6: '天心', 7: '天柱', 8: '天任', 9: '天英' };
  const gates = { 1: '休门', 2: '死门', 3: '伤门', 4: '杜门', 5: '死门', 6: '开门', 7: '惊门', 8: '生门', 9: '景门' };

  return {
    xunShou: xunShouNames[xunShouStem],
    xunShouStem,
    zhiFu: stars[startPalace],
    zhiShi: gates[startPalace],
    startPalace
  };
}

function calculateHeavenPlate(hourGan, hourZhi, juStr) {
  const starsSequence = ['天蓬', '天任', '天冲', '天辅', '天英', '天芮', '天柱', '天心'];
  const originalPalace = {
    '天蓬': 1, '天任': 8, '天冲': 3, '天辅': 4,
    '天英': 9, '天芮': 2, '天柱': 7, '天心': 6
  };
  const palaceSequence = [1, 8, 3, 4, 9, 2, 7, 6];
  const isYang = juStr.startsWith('阳');
  const juNumMap = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
  const juChar = juStr.replace(/[阳阴遁局]/g, '');
  const juNumber = juNumMap[juChar] || 1;
  const earthPalaces = calculateDiPan(juNumber, isYang);

  const ganIndex = tianGan.indexOf(hourGan);
  const zhiIndex = diZhi.indexOf(hourZhi);
  let diff = zhiIndex - ganIndex;
  if (diff < 0) diff += 12;
  const xunShouMap = { 0: '戊', 10: '己', 8: '庚', 6: '辛', 4: '壬', 2: '癸' };
  const leaderStem = xunShouMap[diff] || '戊';

  let leaderPalaceIndex = getDiPanPosition(earthPalaces, leaderStem);
  let isLeaderIn5 = false;
  if (leaderPalaceIndex === 5) {
    isLeaderIn5 = true;
    leaderPalaceIndex = 2;
  }

  const palaceToStar = {};
  for (const [star, palace] of Object.entries(originalPalace)) {
    palaceToStar[palace] = star;
  }
  const zhiFuStar = isLeaderIn5 ? '天禽' : (palaceToStar[leaderPalaceIndex] || '天蓬');

  let targetStem = hourGan;
  if (hourGan === '甲') targetStem = leaderStem;
  let targetPalaceIndex = getDiPanPosition(earthPalaces, targetStem);
  if (targetPalaceIndex === 5) targetPalaceIndex = 2;

  const resultHeavenPlate = {};
  const heavenPlateStems = {};
  const startSeqIdx = zhiFuStar === '天禽'
    ? starsSequence.indexOf('天芮')
    : starsSequence.indexOf(zhiFuStar);
  const targetPalaceSeqIdx = palaceSequence.indexOf(targetPalaceIndex);
  const zhifuOrigPalaceIdx = palaceSequence.indexOf(leaderPalaceIndex);
  const offset = targetPalaceSeqIdx - zhifuOrigPalaceIdx;

  let tianRuiPalace = null;
  for (let i = 0; i < 8; i++) {
    const currentStar = starsSequence[(startSeqIdx + i) % 8];
    const currentPalace = palaceSequence[(targetPalaceSeqIdx + i) % 8];
    resultHeavenPlate[currentPalace] = currentStar;
    if (currentStar === '天芮') tianRuiPalace = currentPalace;
  }

  for (let i = 0; i < 8; i++) {
    const origPalace = palaceSequence[i];
    const newPalaceIdx = (i + (offset % 8) + 8) % 8;
    const newPalace = palaceSequence[newPalaceIdx];
    const stemCarried = earthPalaces[origPalace];
    if (origPalace === 2) {
      const stemGuest = earthPalaces[5];
      heavenPlateStems[newPalace] = [stemCarried, stemGuest];
    } else if (!heavenPlateStems[newPalace]) {
      heavenPlateStems[newPalace] = [stemCarried];
    }
  }

  if (tianRuiPalace) resultHeavenPlate[tianRuiPalace] = '天芮/天禽';
  resultHeavenPlate[5] = '';
  heavenPlateStems[5] = [];

  return {
    plate: resultHeavenPlate,
    stems: heavenPlateStems,
    zhiFuStar,
    targetPalace: targetPalaceIndex
  };
}

function calculateAnGan(zhiShiPalace, hourStem, isYang, leaderStem, earthPalaces) {
  const stemRing = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
  const actualStem = hourStem === '甲' ? leaderStem : hourStem;
  let currentStemIdx = stemRing.indexOf(actualStem);
  if (currentStemIdx === -1) currentStemIdx = 0;

  const anGanResult = {};
  let startPalace = zhiShiPalace;
  if (zhiShiPalace === 5) {
    startPalace = 5;
  } else if (earthPalaces && earthPalaces[zhiShiPalace] === actualStem) {
    startPalace = 5;
  }

  let currentPalace = startPalace;
  for (let i = 0; i < 9; i++) {
    anGanResult[currentPalace] = stemRing[currentStemIdx];
    currentStemIdx = (currentStemIdx + 1) % 9;
    if (isYang) {
      currentPalace += 1;
      if (currentPalace > 9) currentPalace = 1;
    } else {
      currentPalace -= 1;
      if (currentPalace < 1) currentPalace = 9;
    }
  }

  return anGanResult;
}

function calculateDoorPositions(hourGan, hourZhi, juStr) {
  const palaceRing = [1, 8, 3, 4, 9, 2, 7, 6];
  const doorsSequence = ['休', '生', '伤', '杜', '景', '死', '惊', '开'];
  const isYang = juStr.startsWith('阳');
  const juNumMap = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
  const juChar = juStr.replace(/[阳阴遁局]/g, '');
  const juNumber = juNumMap[juChar] || 1;
  const earthPalaces = calculateDiPan(juNumber, isYang);

  const ganIndex = tianGan.indexOf(hourGan);
  const zhiIndex = diZhi.indexOf(hourZhi);
  let diff = zhiIndex - ganIndex;
  if (diff < 0) diff += 12;
  const xunShouMap = { 0: '戊', 10: '己', 8: '庚', 6: '辛', 4: '壬', 2: '癸' };
  const xunShouStem = xunShouMap[diff] || '戊';
  const xunShouLoc = getDiPanPosition(earthPalaces, xunShouStem);
  const gatesMap = { 1: '休', 2: '死', 3: '伤', 4: '杜', 5: '死', 6: '开', 7: '惊', 8: '生', 9: '景' };
  const zhiShi = gatesMap[xunShouLoc];
  const xunShouZhiMap = { '戊': 0, '己': 10, '庚': 8, '辛': 6, '壬': 4, '癸': 2 };
  const xunShouZhiIdx = xunShouZhiMap[xunShouStem];
  let hourOffset = zhiIndex - xunShouZhiIdx;
  if (hourOffset < 0) hourOffset += 12;

  let currentLoc;
  if (isYang) {
    currentLoc = xunShouLoc + hourOffset;
    while (currentLoc > 9) currentLoc -= 9;
  } else {
    currentLoc = xunShouLoc - hourOffset;
    while (currentLoc < 1) currentLoc += 9;
  }
  const zhiShiTargetPalace = currentLoc === 5 ? 2 : currentLoc;

  const resultLayout = {};
  const startIdx = palaceRing.indexOf(zhiShiTargetPalace);
  const doorIdx = doorsSequence.indexOf(zhiShi);
  for (let i = 0; i < 8; i++) {
    const currDoor = doorsSequence[(doorIdx + i) % 8];
    const currPalace = palaceRing[(startIdx + i) % 8];
    resultLayout[currPalace] = currDoor + '门';
  }
  resultLayout[5] = '';

  return {
    layout: resultLayout,
    anGan: calculateAnGan(currentLoc, hourGan, isYang, xunShouStem, earthPalaces),
    zhiShi: zhiShi + '门',
    targetPalace: zhiShiTargetPalace
  };
}

function calculateBaShen(isYang, zhiFuLocation) {
  const deitiesList = ['值符', '螣蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];
  const palaceRing = [1, 8, 3, 4, 9, 2, 7, 6];
  let startPalace = zhiFuLocation;
  if (startPalace === 5) startPalace = 2;
  const startIndex = palaceRing.indexOf(startPalace);
  if (startIndex === -1) return {};
  const resultMap = {};
  if (isYang) {
    for (let i = 0; i < 8; i++) {
      const currentPalaceIndex = (startIndex + i) % 8;
      resultMap[palaceRing[currentPalaceIndex]] = deitiesList[i];
    }
  } else {
    for (let i = 0; i < 8; i++) {
      const currentPalaceIndex = ((startIndex - i) % 8 + 8) % 8;
      resultMap[palaceRing[currentPalaceIndex]] = deitiesList[i];
    }
  }
  resultMap[5] = '';
  return resultMap;
}

function getPalaceByBranch(branchIdx) {
  const mapping = {
    0: 1,
    1: 8, 2: 8,
    3: 3,
    4: 4, 5: 4,
    6: 9,
    7: 2, 8: 2,
    9: 7,
    10: 6, 11: 6
  };
  return mapping[branchIdx] || 0;
}

function calculateKongWangMaXing(stemIdx, branchIdx) {
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const leader = (branchIdx - stemIdx + 12) % 12;
  const voidIdx1 = (leader - 2 + 12) % 12;
  const voidIdx2 = (leader - 1 + 12) % 12;
  const triadMap = {
    8: 2, 0: 2, 4: 2,
    2: 8, 6: 8, 10: 8,
    5: 11, 9: 11, 1: 11,
    11: 5, 3: 5, 7: 5
  };
  const maXingIdx = triadMap[branchIdx];
  return {
    voidBranches: [branches[voidIdx1], branches[voidIdx2]],
    voidPalaces: [...new Set([getPalaceByBranch(voidIdx1), getPalaceByBranch(voidIdx2)])],
    maXingBranch: branches[maXingIdx],
    maXingPalace: getPalaceByBranch(maXingIdx)
  };
}

function computeFixture(input) {
  const [datePart, timePart] = input.solar.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second = 0] = timePart.split(':').map(Number);
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, second);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  if (eightChar.setSect) eightChar.setSect(1);

  const yearPillar = eightChar.getYearGan() + eightChar.getYearZhi();
  const monthPillar = eightChar.getMonthGan() + eightChar.getMonthZhi();
  const dayPillar = eightChar.getDayGan() + eightChar.getDayZhi();
  const hourPillar = eightChar.getTimeGan() + eightChar.getTimeZhi();

  const prevJieQi = lunar.getPrevJieQi();
  const nextJieQi = lunar.getNextJieQi();
  const currentJieqi = prevJieQi.getName();
  const fuTou = getFuTou(eightChar.getDayGan(), eightChar.getDayZhi());
  const sanYuan = getSanYuan(fuTou.zhi);
  const qimenJu = input.ju && input.ju !== '拆补局'
    ? input.ju
    : getQimenJu(currentJieqi, sanYuan);
  const leaders = calculateLeaders(eightChar.getTimeGan(), eightChar.getTimeZhi(), qimenJu);
  const isYang = qimenJu.startsWith('阳');
  const juNumMap = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
  const juChar = qimenJu.replace(/[阳阴遁局]/g, '');
  const juNumber = juNumMap[juChar] || 1;
  const diPan = calculateDiPan(juNumber, isYang);
  const heaven = calculateHeavenPlate(eightChar.getTimeGan(), eightChar.getTimeZhi(), qimenJu);
  const door = calculateDoorPositions(eightChar.getTimeGan(), eightChar.getTimeZhi(), qimenJu);
  const bashen = calculateBaShen(isYang, heaven.targetPalace);
  const kongma = calculateKongWangMaXing(tianGan.indexOf(eightChar.getTimeGan()), diZhi.indexOf(eightChar.getTimeZhi()));

  return {
    ganzhi: `${yearPillar}年 ${monthPillar}月 ${dayPillar}日 ${hourPillar}时`,
    jieqi_pair: `${prevJieQi.getName()}/${nextJieQi.getName()}`,
    current_jieqi: currentJieqi,
    futou: fuTou.ganZhi,
    sanyuan: sanYuan,
    ju: qimenJu,
    xunshou: leaders.xunShou,
    zhifu: leaders.zhiFu,
    zhishi: leaders.zhiShi,
    dipan: diPan,
    tianpan_star: heaven.plate,
    tianpan_stem: heaven.stems,
    tianpan_target: heaven.targetPalace,
    door_layout: door.layout,
    angan: door.anGan,
    door_target: door.targetPalace,
    bashen,
    kongma
  };
}

function main() {
  const files = fs.readdirSync(__dirname).filter((file) => file.endsWith('.json'));
  let failures = 0;
  for (const file of files) {
    const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
    const actual = computeFixture(fixture.input);
    const diffs = [];
    for (const [key, expected] of Object.entries(fixture.expected)) {
      const actualValue = actual[key];
      if (JSON.stringify(actualValue) !== JSON.stringify(expected)) {
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
}

module.exports = { computeFixture };

if (require.main === module) {
  main();
}

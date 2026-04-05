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
const branchElements = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};
const stemElements = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};
const yueJiangNames = {
  '子': '神后', '丑': '大吉', '寅': '功曹', '卯': '太冲', '辰': '天罡', '巳': '太乙',
  '午': '胜光', '未': '小吉', '申': '传送', '酉': '从魁', '戌': '河魁', '亥': '登明'
};
const guiRenPairMap = {
  '甲': { day: '丑', night: '未' },
  '戊': { day: '丑', night: '未' },
  '庚': { day: '丑', night: '未' },
  '乙': { day: '子', night: '申' },
  '己': { day: '子', night: '申' },
  '丙': { day: '亥', night: '酉' },
  '丁': { day: '亥', night: '酉' },
  '壬': { day: '巳', night: '卯' },
  '癸': { day: '巳', night: '卯' },
  '辛': { day: '午', night: '寅' }
};
const guiShenSequence = ['贵人', '腾蛇', '朱雀', '六合', '勾陈', '青龙', '天空', '白虎', '太常', '玄武', '太阴', '天后'];
const guiShenBranchMap = {
  '贵人': '丑',
  '腾蛇': '巳',
  '朱雀': '午',
  '六合': '卯',
  '勾陈': '辰',
  '青龙': '寅',
  '天空': '戌',
  '白虎': '申',
  '太常': '未',
  '玄武': '子',
  '太阴': '酉',
  '天后': '亥'
};
const jieTerms = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
const tianDeByMonth = ['丁', '申', '壬', '辛', '亥', '甲', '癸', '寅', '丙', '乙', '巳', '庚'];
const yueDeByMonth = ['丙', '甲', '壬', '庚', '丙', '甲', '壬', '庚', '丙', '甲', '壬', '庚'];
const tianMaByMonth = ['午', '申', '戌', '子', '寅', '辰', '午', '申', '戌', '子', '寅', '辰'];

function mod(value, base) {
  return ((value % base) + base) % base;
}

function getMonthOrder(monthZhi) {
  const order = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  return order.indexOf(monthZhi);
}

function getBranchTriadHorse(branch) {
  if (['申', '子', '辰'].includes(branch)) return '寅';
  if (['寅', '午', '戌'].includes(branch)) return '申';
  if (['巳', '酉', '丑'].includes(branch)) return '亥';
  if (['亥', '卯', '未'].includes(branch)) return '巳';
  return '';
}

function getJieShaBranch(branch) {
  if (['申', '子', '辰'].includes(branch)) return '巳';
  if (['寅', '午', '戌'].includes(branch)) return '亥';
  if (['巳', '酉', '丑'].includes(branch)) return '寅';
  if (['亥', '卯', '未'].includes(branch)) return '申';
  return '';
}

function getWuZiDunStem(dayGan, branchZhi) {
  const startMap = {
    '甲': '甲', '己': '甲',
    '乙': '丙', '庚': '丙',
    '丙': '戊', '辛': '戊',
    '丁': '庚', '壬': '庚',
    '戊': '壬', '癸': '壬'
  };
  const startGan = startMap[dayGan] || '甲';
  return tianGan[mod(tianGan.indexOf(startGan) + diZhi.indexOf(branchZhi), 10)];
}

function getMonthGeneral(monthZhi, prevJieQiName, method) {
  let monthOrder = getMonthOrder(monthZhi);
  if (method === 'zhongqi' && jieTerms.includes(prevJieQiName)) {
    monthOrder = mod(monthOrder - 1, 12);
  }
  const branch = diZhi[mod(11 - monthOrder, 12)];
  return { branch, name: yueJiangNames[branch] };
}

function resolveGuiMode(hourZhi, mode) {
  if (mode === 'day' || mode === 'night') return mode;
  const hourIdx = diZhi.indexOf(hourZhi);
  return hourIdx >= 3 && hourIdx <= 8 ? 'day' : 'night';
}

function getGuiShen(dayGan, hourZhi, diFenZhi, mode) {
  const resolvedMode = resolveGuiMode(hourZhi, mode);
  const guiBase = (guiRenPairMap[dayGan] || guiRenPairMap['甲'])[resolvedMode];
  const guiBaseIdx = diZhi.indexOf(guiBase);
  const diFenIdx = diZhi.indexOf(diFenZhi);
  const reverseDays = new Set(['壬', '癸', '辛']);
  const isForward = reverseDays.has(dayGan) ? resolvedMode === 'night' : resolvedMode === 'day';
  const offset = isForward ? mod(diFenIdx - guiBaseIdx, 12) : mod(guiBaseIdx - diFenIdx, 12);
  const deity = guiShenSequence[offset];
  const branch = guiShenBranchMap[deity] || diFenZhi;
  return {
    branch,
    stem: getWuZiDunStem(dayGan, branch),
    deity
  };
}

function getJiangShen(dayGan, hourZhi, diFenZhi, monthGeneralZhi) {
  const branch = diZhi[mod(diZhi.indexOf(monthGeneralZhi) + diZhi.indexOf(diFenZhi) - diZhi.indexOf(hourZhi), 12)];
  return {
    branch,
    stem: getWuZiDunStem(dayGan, branch),
    name: yueJiangNames[branch]
  };
}

function getRiKongWang(dayGan, dayZhi) {
  const leader = mod(diZhi.indexOf(dayZhi) - tianGan.indexOf(dayGan), 12);
  return [diZhi[mod(leader - 2, 12)], diZhi[mod(leader - 1, 12)]];
}

function getSiDaKongWang(dayGan, dayZhi) {
  const leader = mod(diZhi.indexOf(dayZhi) - tianGan.indexOf(dayGan), 12);
  if (leader === 0 || leader === 6) return '水';
  if (leader === 2 || leader === 8) return '金';
  return '无';
}

function getRiLuBranch(dayGan) {
  const luMap = {
    '甲': '寅',
    '乙': '卯',
    '丙': '巳',
    '丁': '午',
    '戊': '巳',
    '己': '午',
    '庚': '申',
    '辛': '酉',
    '壬': '亥',
    '癸': '寅'
  };
  return luMap[dayGan] || '';
}

function getTaoHuaBranch(dayZhi) {
  if (['申', '子', '辰'].includes(dayZhi)) return '酉';
  if (['寅', '午', '戌'].includes(dayZhi)) return '卯';
  if (['巳', '酉', '丑'].includes(dayZhi)) return '午';
  if (['亥', '卯', '未'].includes(dayZhi)) return '子';
  return '';
}

function buildGlobalShenShaText(dayGan, dayZhi) {
  const guiPair = guiRenPairMap[dayGan] || guiRenPairMap['甲'];
  return [
    `日禄-${getRiLuBranch(dayGan)}`,
    `驿马-${getBranchTriadHorse(dayZhi)}`,
    `桃花-${getTaoHuaBranch(dayZhi)}`,
    `贵人-${guiPair.day}${guiPair.night}`
  ].join(' · ');
}

function getShaMap(monthZhi, dayGan, dayZhi) {
  const monthOrder = getMonthOrder(monthZhi);
  const monthNumber = monthOrder + 1;
  const guiPair = guiRenPairMap[dayGan] || guiRenPairMap['甲'];
  const tianDe = tianDeByMonth[monthOrder];
  const yueDe = yueDeByMonth[monthOrder];
  const yueDeHeMap = {
    '甲': '己', '己': '甲',
    '丙': '辛', '辛': '丙',
    '壬': '丁', '丁': '壬',
    '庚': '乙', '乙': '庚'
  };
  const tianXi = diZhi[mod(monthNumber + 1, 12)];
  const tianYi = diZhi[mod(diZhi.indexOf(monthZhi) - 1, 12)];
  const sangMen = diZhi[mod(diZhi.indexOf(dayZhi) - 2, 12)];
  const jieLu = diZhi[mod(diZhi.indexOf(dayZhi) - 1, 12)];
  const yiMa = getBranchTriadHorse(dayZhi);
  const tianMa = tianMaByMonth[monthOrder];
  const jieSha = getJieShaBranch(dayZhi);
  const riLu = getRiLuBranch(dayGan);
  const taoHua = getTaoHuaBranch(dayZhi);

  const byStem = {};
  const byBranch = {};
  function push(map, key, value) {
    if (!key) return;
    if (!map[key]) map[key] = [];
    map[key].push(value);
  }

  push(byStem, tianDe, '天德');
  push(byStem, yueDe, '月德');
  push(byStem, yueDeHeMap[yueDe], '月德合');

  push(byBranch, tianYi, '天医');
  push(byBranch, tianXi, '天喜');
  push(byBranch, tianMa, '天马');
  push(byBranch, yiMa, '驿马');
  push(byBranch, jieSha, '劫煞');
  push(byBranch, sangMen, '丧门');
  push(byBranch, jieLu, '截路');
  push(byBranch, riLu, '日禄');
  push(byBranch, taoHua, '桃花');
  push(byBranch, guiPair.day, '贵人');
  push(byBranch, guiPair.night, '贵人');

  return { byStem, byBranch };
}

function buildShaList(gan, zhi, shaMap) {
  const list = [];
  if (gan === '甲') list.push('六甲');
  if (shaMap.byStem[gan]) list.push(...shaMap.byStem[gan]);
  if (shaMap.byBranch[zhi]) list.push(...shaMap.byBranch[zhi]);
  return [...new Set(list)];
}

function getJiShi(monthZhi, dayGan) {
  let monthAvoid = '';
  if (['寅', '午', '戌'].includes(monthZhi)) monthAvoid = '卯';
  else if (['亥', '卯', '未'].includes(monthZhi)) monthAvoid = '子';
  else if (['申', '子', '辰'].includes(monthZhi)) monthAvoid = '酉';
  else if (['巳', '酉', '丑'].includes(monthZhi)) monthAvoid = '午';

  let dayAvoid = '';
  if (['甲', '乙'].includes(dayGan)) dayAvoid = '酉';
  else if (['丙', '丁'].includes(dayGan)) dayAvoid = '子';
  else if (['戊', '己'].includes(dayGan)) dayAvoid = '卯';
  else if (['庚', '辛'].includes(dayGan)) dayAvoid = '午';
  else if (['壬', '癸'].includes(dayGan)) dayAvoid = '未';

  return { monthAvoid, dayAvoid };
}

function getElementRelation(actionElement, targetElement) {
  const generateMap = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const controlMap = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  if (controlMap[actionElement] === targetElement) return '克';
  if (generateMap[actionElement] === targetElement) return '生';
  if (actionElement === targetElement) return '比';
  return '';
}

function getDongYao(renYuan, guiShen, jiangShen, diFen) {
  const motions = [];

  if (getElementRelation(renYuan.element, diFen.element) === '克') motions.push('妻动');
  if (getElementRelation(guiShen.element, jiangShen.element) === '克') motions.push('贼动');
  if (getElementRelation(guiShen.element, renYuan.element) === '克') motions.push('官动');
  if (getElementRelation(diFen.element, renYuan.element) === '克') motions.push('鬼动');
  if (getElementRelation(jiangShen.element, guiShen.element) === '克') motions.push('财动');
  if (getElementRelation(diFen.element, renYuan.element) === '生') motions.push('父母动');
  if (getElementRelation(renYuan.element, diFen.element) === '生') motions.push('子孙动');
  if (renYuan.element === diFen.element) motions.push('兄弟动');

  return motions;
}

function splitDongYao(motions) {
  const wuDongOrder = ['妻动', '贼动', '官动', '鬼动', '财动'];
  const sanDongOrder = ['父母动', '子孙动', '兄弟动'];
  return {
    wuDong: wuDongOrder.filter((item) => motions.includes(item)),
    sanDong: sanDongOrder.filter((item) => motions.includes(item))
  };
}

function getYinYangSign(target) {
  const yangSet = new Set(['甲', '丙', '戊', '庚', '壬', '子', '寅', '辰', '午', '申', '戌']);
  return yangSet.has(target) ? '+' : '-';
}

function getWangXiangState(baseElement, targetElement) {
  if (baseElement === targetElement) return '旺';
  const generateMap = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const controlMap = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  if (generateMap[baseElement] === targetElement) return '相';
  if (generateMap[targetElement] === baseElement) return '休';
  if (controlMap[targetElement] === baseElement) return '囚';
  if (controlMap[baseElement] === targetElement) return '死';
  return '';
}

function resolveYongShen(renYuanSign, guiSign, jiangSign, diFenSign) {
  const signs = [renYuanSign, guiSign, jiangSign, diFenSign];
  const yangCount = signs.filter((sign) => sign === '+').length;
  const yinCount = signs.length - yangCount;

  if (yangCount === 4) return 'guiShen';
  if (yinCount === 4) return 'jiangShen';
  if (yangCount === 2 && yinCount === 2) return 'jiangShen';
  if (yangCount === 1) return guiSign === '+' ? 'guiShen' : 'jiangShen';
  if (yinCount === 1) return guiSign === '-' ? 'guiShen' : 'jiangShen';
  return 'jiangShen';
}

function computeFixture(input) {
  const [datePart, timePart] = input.solar.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  if (eightChar.setSect) eightChar.setSect(1);

  const yearPillar = eightChar.getYearGan() + eightChar.getYearZhi();
  const monthPillar = eightChar.getMonthGan() + eightChar.getMonthZhi();
  const dayPillar = eightChar.getDayGan() + eightChar.getDayZhi();
  const hourPillar = eightChar.getTimeGan() + eightChar.getTimeZhi();

  const prevJieQi = lunar.getPrevJieQi().getName();
  const prevJie = lunar.getPrevJie ? lunar.getPrevJie().getName() : prevJieQi;
  const nextJie = lunar.getNextJie ? lunar.getNextJie().getName() : (lunar.getNextJieQi ? lunar.getNextJieQi().getName() : '');
  const diFen = input.difen;
  const guiMode = input.gui_mode;
  const jiangMode = input.jiang_mode;
  const monthGeneral = getMonthGeneral(eightChar.getMonthZhi(), prevJieQi, jiangMode);
  const guiShen = getGuiShen(eightChar.getDayGan(), eightChar.getTimeZhi(), diFen, guiMode);
  const jiangShen = getJiangShen(eightChar.getDayGan(), eightChar.getTimeZhi(), diFen, monthGeneral.branch);
  const renYuan = getWuZiDunStem(eightChar.getDayGan(), diFen);
  const shaMap = getShaMap(eightChar.getMonthZhi(), eightChar.getDayGan(), eightChar.getDayZhi());
  const jiShi = getJiShi(eightChar.getMonthZhi(), eightChar.getDayGan());
  const jiShiText = [...new Set([jiShi.monthAvoid, jiShi.dayAvoid].filter(Boolean))].join('') || '无';
  const { wuDong, sanDong } = splitDongYao(
    getDongYao(
      { element: stemElements[renYuan] },
      { element: branchElements[guiShen.branch] },
      { element: branchElements[jiangShen.branch] },
      { element: branchElements[diFen] }
    )
  );
  const renYuanElement = stemElements[renYuan];
  const guiShenElement = branchElements[guiShen.branch];
  const jiangShenElement = branchElements[jiangShen.branch];
  const diFenElement = branchElements[diFen];
  const renYuanSign = getYinYangSign(renYuan);
  const guiShenSign = getYinYangSign(guiShen.stem);
  const jiangShenSign = getYinYangSign(jiangShen.stem);
  const diFenSign = getYinYangSign(diFen);
  const yongshen = resolveYongShen(renYuanSign, guiShenSign, jiangShenSign, diFenSign);

  return {
    ganzhi: `${yearPillar}年 ${monthPillar}月 ${dayPillar}日 ${hourPillar}时`,
    jiepair: `${prevJie}/${nextJie}`,
    yuejiang: monthGeneral.branch,
    shensha: buildGlobalShenShaText(eightChar.getDayGan(), eightChar.getDayZhi()),
    rikong: getRiKongWang(eightChar.getDayGan(), eightChar.getDayZhi()).join('、'),
    sidakongwang: getSiDaKongWang(eightChar.getDayGan(), eightChar.getDayZhi()),
    guishen_sha: buildShaList(guiShen.stem, guiShen.branch, shaMap).join('、') || '无神煞',
    jiangshen_sha: buildShaList(jiangShen.stem, jiangShen.branch, shaMap).join('、') || '无神煞',
    difen_sha: buildShaList('', diFen, shaMap).join('、') || '无神煞',
    jishi: jiShiText === '无' ? '无' : `${jiShiText}时`,
    wudong: wuDong.length ? wuDong.join('、') : '无',
    sandong: sanDong.length ? sanDong.join('、') : '无',
    yongshen,
    renyuan: renYuan,
    renyuan_element: renYuanElement,
    renyuan_signstate: `${renYuanSign}${getWangXiangState(renYuanElement, renYuanElement)}`,
    guishen: `${guiShen.stem}${guiShen.branch}（${guiShen.deity}）`,
    guishen_element: guiShenElement,
    guishen_signstate: `${guiShenSign}${getWangXiangState(renYuanElement, guiShenElement)}`,
    jiangshen: `${jiangShen.stem}${jiangShen.branch}（${jiangShen.name}）`,
    jiangshen_element: jiangShenElement,
    jiangshen_signstate: `${jiangShenSign}${getWangXiangState(renYuanElement, jiangShenElement)}`,
    difen: diFen,
    difen_element: diFenElement,
    difen_signstate: `${diFenSign}${getWangXiangState(renYuanElement, diFenElement)}`,
    meta: {
      monthElement: branchElements[eightChar.getMonthZhi()],
      renYuanElement
    }
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
}

module.exports = { computeFixture };

if (require.main === module) {
  main();
}

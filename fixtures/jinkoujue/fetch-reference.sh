#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 8 || $# -gt 9 ]]; then
  echo "usage: $0 YEAR MONTH DAY HOUR MINUTE DIFEN(branch) GUI_MODE(auto|day|night) JIANG_MODE(jie|zhongqi) [OUTPUT_FILE]" >&2
  exit 1
fi

year="$1"
month="$2"
day="$3"
hour="$4"
minute="$5"
difen="$6"
gui_mode="$7"
jiang_mode="$8"
output_file="${9:-}"

case "$difen" in
  子) ju="1" ;;
  丑) ju="2" ;;
  寅) ju="3" ;;
  卯) ju="4" ;;
  辰) ju="5" ;;
  巳) ju="6" ;;
  午) ju="7" ;;
  未) ju="8" ;;
  申) ju="9" ;;
  酉) ju="10" ;;
  戌) ju="11" ;;
  亥) ju="12" ;;
  *)
    echo "unsupported difen: $difen" >&2
    exit 1
    ;;
esac

if [[ "$gui_mode" == "auto" ]]; then
  # 与页面实现一致：卯时到申时取昼贵，其余取夜贵
  if (( hour >= 5 && hour < 17 )); then
    gui_mode="day"
  else
    gui_mode="night"
  fi
fi

case "$gui_mode" in
  day) gui_param="%D6%E7%B9%F3" ;;
  night) gui_param="%D2%B9%B9%F3" ;;
  *)
    echo "unsupported gui mode: $gui_mode" >&2
    exit 1
    ;;
esac

case "$jiang_mode" in
  jie) jiang_param="V1" ;;
  zhongqi) jiang_param="V2" ;;
  *)
    echo "unsupported jiang mode: $jiang_mode" >&2
    exit 1
    ;;
esac

data="years=${year}&months=${month}&days=${day}&hours=${hour}&mins=${minute}&ju=${ju}&D1=${gui_param}&R1=${jiang_param}&button1=%C5%C5%C5%CC"

if [[ -n "$output_file" ]]; then
  curl -sL --max-time 20 "https://www.china95.net/paipan/jinkoujue_show.asp" --data "$data" \
    | perl -0pe 'binmode STDIN; binmode STDOUT; s/\x00//g' \
    | iconv -c -f gb18030 -t utf-8 > "$output_file"
else
  curl -sL --max-time 20 "https://www.china95.net/paipan/jinkoujue_show.asp" --data "$data" \
    | perl -0pe 'binmode STDIN; binmode STDOUT; s/\x00//g' \
    | iconv -c -f gb18030 -t utf-8
fi

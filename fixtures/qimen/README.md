# Qimen Fixtures

这组 fixture 预留给奇门遁甲回归测试，参考源指定为：

- `https://www.china95.net/paipan/qimen.asp`

当前状态：

- 已确认本地页面中的奇门主链路函数位置在 `奇门遁甲+金口诀排盘.html`。
- 已落最小本地回归脚本 `evaluate-current.js` 和 2 组待对站样本。
- 旧版参考站表单页可以抓到，但 `qimen_show.asp` 在脚本化 POST 下当前返回 `500 - Internal server error`。
- 这意味着奇门 fixture 还不能像金口诀一样直接用 `curl` 自动沉淀，需要后续补一条稳定的浏览器抓取链路，或者通过人工截图/原始页保存转录。

后续计划：

- 先锁最小字段集：`节气`、`三元`、`局数`、`旬首`、`值符`、`值使`。
- 再扩到 `天盘九星`、`八门`、`八神`、`空亡马星` 和 `综合盘九宫`。

目录约定：

- `raw/`：参考站原始 HTML 或转存片段。
- `screenshots/`：参考站截图。

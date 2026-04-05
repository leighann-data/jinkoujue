# JinKouJue Fixtures

这组 fixture 用来固定目前已经和参考站核对过的关键样本，避免每次调规则都重新在线查询。

内容约定：

- `*.json`：结构化预期结果，用于本地算法回归。
- `raw/`：参考站原始 HTML 快照。
- `screenshots/`：预留给参考页截图。

说明：

- 当前 fixture 既跑 `evaluate-current.js` 的算法回归，也跑 `verify-raw.js` 的原始页逐项核对。
- 当前已开始保存参考站原始结果页到 `raw/`，后续新增样本优先同步保存原始页。
- 当前环境的浏览器截图链路还不稳定，所以 `screenshots/` 仍先保留目录，待工具稳定后补齐。

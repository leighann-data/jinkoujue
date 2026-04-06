# 奇门遁甲和金口诀排盘工具

这是一个纯前端静态排盘页面，当前包含两块能力：

- 奇门遁甲排盘
- 金口诀排盘

站点入口使用根目录的 [index.html](/Users/leighann/Workspace/jinkoujue/index.html)，它会跳转到当前主页面 [qimen-jinkoujue-0405.html](/Users/leighann/Workspace/jinkoujue/qimen-jinkoujue-0405.html)。

## 当前交互

- 页面打开后，会基于“当前时间 + 默认北京位置”先自动推算一次奇门局数
- 用户可以调整阴阳遁和局数
- 点击“确认局数”后，才可以点击“信息确认，开始计算”
- 金口诀与奇门结果在同一结果区内通过 tab 切换

## 本地使用

直接在浏览器打开根目录的 `index.html` 即可。

注意：

- 主页面 [qimen-jinkoujue-0405.html](/Users/leighann/Workspace/jinkoujue/qimen-jinkoujue-0405.html) 通过 CDN 加载 `lunar-javascript` 和 `suncalc`
- 因此本地打开页面时，仍需要可用网络

如果需要本地验证数据回归，可以运行：

```bash
node fixtures/jinkoujue/evaluate-current.js
node fixtures/jinkoujue/verify-raw.js
node fixtures/qimen/evaluate-current.js
```

## 项目结构

- [qimen-jinkoujue-0405.html](/Users/leighann/Workspace/jinkoujue/qimen-jinkoujue-0405.html)：当前主页面
- [index.html](/Users/leighann/Workspace/jinkoujue/index.html)：站点入口
- [奇门遁甲+金口诀排盘.html](/Users/leighann/Workspace/jinkoujue/奇门遁甲+金口诀排盘.html)：旧主文件名兼容跳转
- [奇门遁甲排盘.html](/Users/leighann/Workspace/jinkoujue/奇门遁甲排盘.html)：旧入口兼容跳转
- [fixtures/jinkoujue](/Users/leighann/Workspace/jinkoujue/fixtures/jinkoujue)：金口诀 fixture、参考页快照和校验脚本
- [fixtures/qimen](/Users/leighann/Workspace/jinkoujue/fixtures/qimen)：奇门 fixture 和本地回归脚本
- [vendor/lunar.js](/Users/leighann/Workspace/jinkoujue/vendor/lunar.js)：测试脚本使用的本地 `lunar-javascript`

## 测试状态

### 金口诀

金口诀目前有两条测试链：

- `evaluate-current.js`：直接对本地计算结果做结构化回归
- `verify-raw.js`：对照 `raw/` 中保存的 china95 参考页逐项核对

当前 fixture 已覆盖：

- 子时换日
- 节气与中气换将
- 昼贵与夜贵
- 多个地分分支
- 神煞顶层汇总
- 忌时、五动、三动
- `壬 / 癸` 日日禄边界

### 奇门

- 当前有本地回归脚本 `fixtures/qimen/evaluate-current.js`
- 目前主要用于锁定现有实现，尚未像金口诀一样完成对参考站的逐页原始结果核对
- 参考站 `qimen_show.asp` 对脚本化抓取不稳定，后续如果补上稳定抓取链路，可以继续升级 fixture

## 发布

仓库按静态站方式发布：

- 根目录提供 `index.html`
- 直接推送到 GitHub 仓库即可更新站点
- 若仓库已开启 GitHub Pages，发布地址通常为：
  `https://leighann-data.github.io/jinkoujue/`

后续如果继续迭代，建议始终以 [qimen-jinkoujue-0405.html](/Users/leighann/Workspace/jinkoujue/qimen-jinkoujue-0405.html) 为主文件，`index.html` 和两个中文旧文件只保留为兼容入口。

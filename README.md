# 金口诀与奇门遁甲排盘

这是一个纯前端静态排盘页面，当前包含两块能力：

- 奇门遁甲排盘
- 金口诀排盘

页面入口默认使用根目录的 [index.html](/Users/leighann/Workspace/jinkoujue/index.html)，它会跳转到主页面 [qimen-jinkoujue-0405.html](/Users/leighann/Workspace/jinkoujue/qimen-jinkoujue-0405.html)。

## 本地使用

直接在浏览器打开根目录的 `index.html` 即可。

如果需要本地验证数据回归，可以运行：

```bash
node fixtures/jinkoujue/evaluate-current.js
node fixtures/jinkoujue/verify-raw.js
node fixtures/qimen/evaluate-current.js
```

## 项目结构

- [qimen-jinkoujue-0405.html](/Users/leighann/Workspace/jinkoujue/qimen-jinkoujue-0405.html)：主页面
- [fixtures/jinkoujue](/Users/leighann/Workspace/jinkoujue/fixtures/jinkoujue)：金口诀 fixture、原始参考页和校验脚本
- [fixtures/qimen](/Users/leighann/Workspace/jinkoujue/fixtures/qimen)：奇门 fixture 和校验脚本
- [vendor/lunar.js](/Users/leighann/Workspace/jinkoujue/vendor/lunar.js)：本地测试使用的 `lunar-javascript`

## 金口诀测试

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

## 发布

仓库按静态站方式发布：

- 根目录提供 `index.html`
- 可直接推送到 GitHub 仓库
- 若仓库已开启 GitHub Pages，发布地址通常为：
  `https://leighann-data.github.io/jinkoujue/`

如果后续要继续迭代页面，建议始终以 [qimen-jinkoujue-0405.html](/Users/leighann/Workspace/jinkoujue/qimen-jinkoujue-0405.html) 为主文件，`index.html` 只保留为站点入口。

## 了解过哪些样式实现方案？为什么 AI产品都选择 Tailwind CSS 作为样式方案？

### 主流样式实现方案
本质上是
1. 可维护性
2. 开发效率
3. 性能
- 手写原生CSS&CSS预处理器(Sass/Less)

- css in js (styled-components 停止维护, emotion)
优势：
1. 组件化：每个组件都有自己的样式,避免全局样式冲突
2. 动态样式：可以根据组件状态动态切换样式,无需手动编写条件判断

问题：
1. 运行时开销：需要运行时解析js并生成CSS,带来一定性能损耗
2. 心智负担：需要学习新的API和语法,增加开发成本

Utility-First CSS (Tailwind CSS)
###

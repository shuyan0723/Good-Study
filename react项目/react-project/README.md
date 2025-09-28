
- SCSS是什么？
SCSS是一种后缀名为.scss的**预编译CSS语言**，支持一些原生CSS
不支持的高级用法，比如变量使用，嵌套语法等，使用SCSS可以
让样式代码**更加高效灵活**

1. 安装包 npm i sass -D 
2. 测试.scss文件是否可用（嵌套语法）
style.scss -> sass -> style.css

- Ant Design 是什么？
Ant Design 是蚂蚁金服出品的社区使用最广的react PC端
组件库，内置了常用的现成组件，可以帮助我们快速开发PC管理
后台项目
安装包：npm i antd --save

- 配置基础路由Router
1. 安装包 npm i react-router-dom --save

- 配置@别名路径？
什么是@别名路径？
通过@替代src路径，方便开发过程中的路径查找访问

import Layout from '../pages/Layout'
import Layout from '@/pages/Layout'
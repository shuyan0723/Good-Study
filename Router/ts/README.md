# 路由
每个界面都有很多重复的部分，比如导航栏、底部栏、侧边栏等
抽离公共部分，代码复用

## 按设计，
新建如干个页面（即react组件）
为每个页面配置对应的路由
分配相应的模板

## React-Router 路由管理工具
新建若干个页面和Layout组件
使用react-router 配置路由，并用于项目
使用路由功能，如页面跳转，获取参数等

## 两种方式跳转页面
1. 链接的形式 link这个自定义组件
2. 带一个参数   <Link to='/discover?534534'>发现</Link>
3. 带多个参数   <Link to='/discover?534534&name=张三'>发现</Link>
 nav('/login?5388484884')

 id是动态的，动态参数动态路由

 const {id}=useParams()
 useNavigate 通过js参数跳转页面
 useParams 获取动态参数
 useSearchParams 获取url参数 
 第三方参数
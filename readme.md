React 要求所有函数组件都是纯函数
相同的输入就必须要有相同的输出
## useState
声明状态变量，实现组件内部状态管理与更新，
当状态改变时，组件会进行重新渲染
## useReducer
方便对一个状态的操作方式做管理
减少useState的操作
function useReducer(state, action) 
state: 当前要管理状态是哪一个
action: 对状态进行哪些操作
## useRef
useRef用于创建一个数据存储的容器
值可以手动修改，并不是响应式状态
常用于访问dom元素和存储一些数据
## useContext
useContext用于在组件之间共享状态
 避免props层层传递
## useEffect
代表的是副作用函数
副作用指的是与组件状态或属性变化无关的操作，
useEffect管理异步操作和非执行的副作用
这些操作包括：
1. 数据获取
2. DOM操作
3. 定时器
4. 事件监听
## useMemo
useMemory 用来进行数据缓存的钩子
 创建一个可以进行缓存操作的空间
内部如果做一些复杂计算
## useCallback
useCallback 用来进行函数缓存的钩子

相似点，都是都过缓存来达到性能优化的目的
import { useState } from 'react'
import './App.css'


// const message = 'Hello, World!'
// const number = 42
// function getName() {
//   return 'John Doe'
// }

// const list = [
//   { id: 1, name: 'Item 1' },
//   { id: 2, name: 'Item 2' },
//   { id: 3, name: 'Item 3' }
// ]
// function App() {
//   return (
//     // <div>
//     //   <h1>this is a title</h1>
//     //   {message}
//     //   {/* 使用引号传递字符串 */}
//     //   {'this is a string'}
//     //   {/* 识别js变量 */}
//     //   {number}
//     //   {/* 调用函数 */}
//     //   {getName()}
//     //   {/* 方法调用 */}
//     //   {new Date().getDate()}
//     //   {/* 使用js对象 */}
//     //   <div style={{ color: 'red', fontSize: '20px' }}>this is a div</div>
//     // </div>
//     <div className='App'>
//       this is App
//       {/* 渲染列表 */}
//       {/* map 循环哪个结构 return哪个结构 */}
//       {/* 注意事项：加上第一无二的key string 或者 number */}
//       {/* key的作用: React框架内部使用 提升更新性能 */}
//       <ul>
//         {/* 每个list要有一个第一无二的key*/}
//         {list.map(item =>
//           <li key={item.id}>{item.name}</li>
//         )}
//       </ul>
//       {/* 自闭和 */}
//       <Button />
//       {/* 成对标签 */}
//       <button></button>
//     </div>
//   )
// }
// 1.定义组件
// const Button = () => {
//   return <button>Click Me!!</button>;
// }

// function App() {
//   return (
//     <div className="App">
//       {/* 2.使用组件(渲染) */}
//       {/* 自闭和 */}
//       <Button />
//       {/* 成对标签 */}
//       <Button></Button>
//     </div>
//   )
// }
// useState实现一个计数器按钮

// function App() {
//   // 1.调用useState添加一个状态变量
//   // count 状态变量
//   // setCount 更新状态变量的函数 修改状态变量的方法
//   // const [count, setCount] = useState(0)
//   let [count, setCount] = useState(0)

//   // 2.点击事件回调
//   const handleClick = () => {
//     // 作用:1.用传入的新值修改count
//     // 2.重新使用新的count渲染UI
//     setCount(count + 1)
//     // count++
//     // console.log(count)
//   }
//   const [form, setForm] = useState({ name: '张三' }) // 不能在函数组件中调用useState
//   const changeForm = () => {
//     // 错误写法:直接修改form对象的属性值
//     // 这样做会导致React无法检测到状态的变化，从而不会触发
//     //form.name = '李四' // 直接修改form对象的属性值
//     // 正确写法:使用setForm函数来更新状态
//     // setForm({ name: '李四' }) // 传入一个新的对象
//     setForm({
//       ...form,
//       name: '李四' // 使用展开运算符保留其他属性
//     })
//   }

//   return (
//     <div>
//       <button onClick={handleClick}>Count:{count}</button>
//       <button onClick={changeForm}>修改form{form.name}</button>

//     </div>
//   )
// }
function App() {
  const songs = [
    { id: 1, name: "演员" },
    { id: 2, name: "江南" },
    { id: 3, name: "曹操" },
  ]
  const name = '超人强'
  const flag = true
  return (
    <div className='App'>
      {/* <ul>
        {
          songs.map((item) => {
            // return <li>{item.name}</li>
            return <li>{item.id}
              {item.name}</li>
          })
        }
      </ul> */}
      <h1>猪猪侠{name}</h1>
      <h3>{flag ? 'react好' : 'react坏'}</h3>
      <div>{flag ? <span>看</span> : null}</div>
    </div>
  )
}
export default App

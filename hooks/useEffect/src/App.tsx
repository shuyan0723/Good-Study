import { useState } from 'react'
import './App.css'

// function App() {
//   // const [count, setCount] = useState(0)
//   // useEffect(()=>{},[])
//   useEffect(() => {
//     // 副作用：修改浏览器标题
//     document.title = 'useEffect'
//     console.log('useEffect')
//     // 清理副作用，组件卸载时把标题改回来
//     return ()=>{
//       document.title='React'
//       console.log('组件卸载了');
//     }
//   }, [])
    

//   return (
//     <>
//       <h1>welcome to useEffect</h1>
//     </>
//   )
// }
// function App(){
//   let num=1
  
//   function handle(){
//     console.log('btn被点击了');
//     num++
//     console.log(num);
//     //  多么希望有一个响应式方法，监听住这个num,只要num更新
//     //  这个方法就会触发视图更新
//   }
//   return(
//     // <>
//     //  <h1>hello useEffect</h1>
//     // </>
//     <div>
//       <button onClick={handle}>{num}</button>
      
//       </div>
//   )
// }
function App(){
   let [num,setNum]=useState(1) // [1,func]
function handle(){
  setNum(num+1) // 将num修改为参数值,并触发视图更新
  console.log(num);
}

  return(
    <>
       <button onClick={handle}>{num}</button>
       
    </>
  )
}



export default App

// import { useState } from 'react'
import {FC,useRef} from 'react'
import './App.css'

    // ts 泛型
// const Demo:FC=()=>{ 
//           const inputRef=useRef<HTMLInputElement>(null)

//         function selectInput(){
//             inputRef.current?.select()
//         }
//   return (
//     <div>
//       <input ref={inputRef} type="text" />
//         <button onClick={selectInput}>选择输入框</button>
//     </div>
//   )
// }

const Demo:FC=()=>{
  const nameRef=useRef('123')  // 不是 DOM 节点，普通的JS变量

  function changeName(){
    nameRef.current='456'   //结果还是123，因为nameRef.current是一个普通的JS变量，
    // 不是DOM节点，所以不会触发重新渲染   修改ref值，不会触发rerender(state会触发)
    console.log(nameRef.current);
    
  }

  return (
    <div>
      <h1>{nameRef.current}</h1>
      <button onClick={changeName}>改变名称</button>
    </div>
  )
}

export default Demo

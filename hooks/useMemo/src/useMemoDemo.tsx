// 函数组件，每次state更新都会重新执行函数，就是函数里面的每行代码都会重新执行
 // useMemo 可以缓存数据，不用每次执行函数都重新生成
 // 可用于计算量比较大的场景，用于缓存性能

 
import React, {FC, useMemo,useState } from 'react'

const Demo:FC=()=>{
  console.log('demo........');//每次更新导致函数重新更新
  
   const [num1,setNum1]=useState(10)
   const [num2,setNum2]=useState(20)
   const [text,setText]=useState('hello')

   // useEffect(fn,[x,y])
   const sum=useMemo(()=>{
    console.log('useMemo执行了');//缓存 不因text更新而执行
      return num1+num2
      
      
   },[num1,num2])

   return(
   <>
    {sum}
    <h1>{num1}</h1>
    <button onClick={()=>setNum1(num1+1)}>num1+1</button>
    <h2>{num2}</h2>
    <button onClick={()=>setNum2(num2+1)}>num2+1</button>

    <div>
        {/* 受控组件 */}
        <input onChange={(e)=>setText(e.target.value)} value={text}></input>
    </div>
   </>
   )
}
export default Demo
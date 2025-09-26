// useCallback 缓存函数

import  React, { FC,useCallback,useState} from 'react'

const Demo: FC=()  => {
    const [text,setText]=useState('hello')

    const fn1=()=>console.log('fn1',text);
    const fn2=useCallback(()=>{
      console.log('fn2',text);
    },[text]);
    

 return(
    <>
    <button onClick={fn1}>fn1</button>
    <button onClick={fn2}>fn2</button>
  <input onChange={e=>setText(e.target.value)} 
   value={text}
  ></input>
    </>
 )
}
export default Demo
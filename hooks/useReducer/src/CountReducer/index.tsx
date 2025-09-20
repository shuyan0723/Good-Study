// import { useState } from "react";

import  { useReducer } from "react";

type StateType={ count:number};
type ActionType ={type:string};

const initialState:StateType={ count:100,} // 初始值

// 根据传入的 action 返回新的state(不可变数据) 
 function reducer(state:StateType,action:ActionType){
    switch(action.type){
        case 'increment':
            return {count:state.count+1}
         case 'decrement':
            return {count:state.count-1}   
         default:
            throw new Error('error')   
    }
 }


const CountReducer=()=>{
//    const [count,setCount]=useState(100);
   const [state,dispatch]=useReducer(reducer,initialState)
 
   return (
    <>
    {/* <p>当前计数：{count}</p> */}
    <p>当前计数：{state.count}</p>
    {/* <button onClick={()=>setCount(count+1)}>+</button>
    <button onClick={()=>setCount(count-1)}>-</button> */}
    <button onClick={()=>dispatch({type:'increment'})}>+</button>
    <button onClick={()=>dispatch({type:'decrement'})}>-</button>
    </>
   )
}

export default CountReducer;
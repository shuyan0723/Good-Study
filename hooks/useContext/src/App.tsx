import { useState } from 'react'

import './App.css'

function countReducer(state:number,action:string){
  switch(action){
    case 'increment':
      return state+1
    case 'decrement':
      return state-1
    default:
      return state
  }
}

function App() {
  // 计数器
  const [count, setCount] = useState(0)
  const handleIncrement=()=>setCount(count+1)
  const handleDecrement=()=>setCount(count-1)
  return (
    <div style={{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      height:'100vh'
    }}>
      <h1>useContext</h1>
      {/* <button onClick={handleIncrement}>+</button>
      // <span>{count}</span>
      <button onClick={handleDecrement}>-</button> */}
      <button onClick={()=>setCount(countReducer(count,'increment'))}>+1</button>
       <span>{count}</span>
      <button onClick={()=>setCount(countReducer(count,'decrement'))}>-1</button>
    </div>
  )
}

export default App

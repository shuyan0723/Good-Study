import { useState } from 'react'
import './App.css'

function App() {
  const [count, abc] = useState(0)//[1,func]

  function handle(){
    abc(count+1)
    console.log(count);
    console.log(abc);
  }
  return (
    <div>
      <button onClick={handle}>{count}</button>
    </div>
  )
}

export default App

import { useState } from 'react'
import './App.css'



function MyButton(){
  return (
    <button>
      这是一个按钮
    </button>
  )
}
function App() {
  // const [count, setCount] = useState(0)
  return (
    <div>
      <h1>欢迎来到我的应用</h1>
      <p>这是一个简单的React应用<br />你好啊！你还好吗？</p>
      <MyButton />
    </div>
  )
}

export default App

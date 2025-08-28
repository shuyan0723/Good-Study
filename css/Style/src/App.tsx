import { useState } from 'react'

import './App.css'

function App() {
  

  return (
    <div>
        {/* <h1 style={{color:'red'}}>内联样式style</h1> */}
      {0? <span style={{color:'red'}}>我是span</span> :<span style={{color:'blue'}}>我是蓝色</span>}
    </div>
  )
}

export default App

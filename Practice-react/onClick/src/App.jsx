import { useState } from 'react'
import './App.css'

function App() {
  const handleClick = (e) => {
    console.log('Button被点击了', e);

  }
  return (
    <div className='App'>
      {/* on+事件名称=事件处理程序 */}
      <button onClick={handleClick}>点击我</button>

    </div>
  )
}

export default App

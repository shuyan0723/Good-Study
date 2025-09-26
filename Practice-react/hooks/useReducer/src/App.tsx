import { useState } from 'react'
import CountReducer from './CountReducer/index'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     
      <h1>App page</h1>
       <CountReducer />
       {/* <CountReducer /> */}
    </>
  )
}

export default App

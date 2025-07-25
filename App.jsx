import { useState } from 'react'
import './App.css'

function App() {
  const flag = false;
  const loading = true;

  return (
    <>
      {flag && <span>this span</span>}
      {loading ? <span>123</span> : <span>456</span>}
    </>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import Header from './components/Header'
function App() {
  const [user,setUser]=useState(null)


  return (
    <>
     <Header user={user} onLogout={()=>setUser(null)} />
      <Sider />
      <Main user={user} />
      <Header />
    </>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import {ThemeContext} from './contexts/ThemeContext'
import Head from './components/Header'
import Mai from './components/Main'

function App() {

  const [theme, setTheme] = useState('dark')

  return (
    <ThemeContext.Provider value={{theme,setTheme}}>
      <Head />
      <Mai />
    </ThemeContext.Provider>
  )
}

export default App




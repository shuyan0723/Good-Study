import {useContext} from 'react'
import {ThemeContext} from '../contexts/ThemeContext'

function Head(){
    const {theme,setTheme}=useContext(ThemeContext);
    return (
        <header style={{background:theme==='dark' ? '#222' : '#fff'}}>
               <h1>Header</h1>
            <button onClick={()=>setTheme(theme==='dark'?'light':'dark')}>
                切换主题
            </button>
         </header>
    )
}
export default Head
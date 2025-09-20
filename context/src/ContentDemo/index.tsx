import { createContext, useState } from 'react';
import ToolBar from './ToolBar'

const themes={
    light:{
        fore:'#000',
        background:'#eee'
    },
    dark:{
        fore:'#fff',
        background:'#222'
    }
}

// 定义 ThemeContext
export const ThemeContext=createContext(themes.light)

const Demo=()=>{
  const[theme,setTheme]=useState(themes.light);
  function toDark(){
     setTheme(themes.dark)
  }

   return (
    <ThemeContext.Provider value={theme}>
       <div>
         {/* <p>Context Demo</p> */}
           <span> Context Demo</span>
              <button onClick={toDark}>
                   dark
              </button>  
       </div>
       <ToolBar />
    </ThemeContext.Provider>
   )
}

export default Demo;
import { useContext } from 'react';
import { ThemeContext } from './index';


const ThemeButton=()=>{
  const theme=useContext(ThemeContext);

  // 根据 theme 设置button 样式

  const style={
    color:theme.fore,
    background:theme.background
  }

    return (
        <>
          <button style={style}>切换主题</button>
        </>
    )
}
export default ThemeButton;
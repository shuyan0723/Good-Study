import {useContext} from 'react'
import {ThemeContext} from '../contexts/ThemeContext'


function Mai(){
    const {theme}=useContext(ThemeContext)
    return (
     <p>当前主题:{theme}</p> 
    )
}
export default Mai
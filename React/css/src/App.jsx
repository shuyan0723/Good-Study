import { useState } from 'react'
import './App.css'

const user={
  name:'小姐姐',
  age:18,
  imageUrl:'https://cn.bing.com/images/search?q=%e5%b0%8f%e5%a7%90%e5%a7%90&id=8C91ACD6FF177FCAD582E9C3EB3F7296546C7781&FORM=IQFRBA&first=1',
  imageSize:90,
};
function App() {
 

  return (
    <>
      <h1>{user.name}</h1>
      <img
        classname="avatar"
        src={user.imageUrl}
        alt={'photo of ' + user.name}
        style={{
          width:user.imageSize,
          height:user.imageSize,
        }}
        />
    </>
  )
}

export default App

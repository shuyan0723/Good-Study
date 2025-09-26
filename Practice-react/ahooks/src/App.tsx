import { useEffect, useState } from 'react'
import './App.css'
// import { useTitle,useMouse } from 'ahooks'

function fn(){
  useEffect(()=>{
    console.log('fn')
  })
}
useEffect(()=>{
  console.log('useEffect')
})

function App() {
//   useTitle('app')
// const mouse=useMouse()
// console.log(mouse)

const b=true
if(b){

}


  return (
     <>
    {/* //   <h1>{mouse.clientX}</h1>
    //   <h1>{mouse.clientY}</h1> */}
    </>
  )
}

export default App

import { useEffect, useState } from 'react'

import './App.css'
import '../src/_Mock/mock'
import axios from 'axios'
function App() {
  // react 16.8以后会执行两次
  useEffect(()=>{
    // console.log('useEffect')
    // fetch('./api/test')
    // .then(res=>res.json())
    // .then(data=>console.log('fetch data',data))
    axios.get('./api/test')
    .then(res=>
      console.log('res axios',res.data)
    )
    },[])
   
  return (
   
   <>
   </>
  )
}

export default App

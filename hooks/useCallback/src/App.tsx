import { useState,useEffect } from 'react'
import './App.css'
import UseCallbackDemo from './useCallbackDemo.tsx'
import useGetInfo from './hooks/usegetInfo'
import useTitle from  './hooks/useTitle'


function App() {
    // useTitle('自定义hooks1231215615')
  
const {loading,info}=useGetInfo()
  return (
    <>
    <h1>自定义hooks</h1>
    <p>{loading?'加载中':info}</p> 
     <UseCallbackDemo/>
    </>
  )
}

export default App

import React,{FC,useRef,useState,useEffect} 
from "react";


const Demo:FC=()=>{
    const [count,setCount]=useState(0)

    function add(){
        setCount(count+1)
    }

    function alertFn(){
        
    }
    return
        <>
            闭包陷阱
        </>
    
}
export default Demo

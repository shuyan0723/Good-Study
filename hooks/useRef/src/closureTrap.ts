import React,{FC,useRef,useState,useEffect} 
from "react";


const Demo:FC=()=>{
    const [count,setCount]=useState(0)

    function add(){
        setCount(count+1)
    }

    function alertFn(){
        setTimeout(()=>{
            alert(count)
        },3000)
    }
    return
        <>
            
            <div>
                <button onClick={add}>+</button>
                <button onClick={alertFn}>alert</button>
            </div>
        </>
    
}
export default Demo

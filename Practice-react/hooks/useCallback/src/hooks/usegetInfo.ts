import { useState,useEffect } from 'react'

// 异步获取信息
function getInfo():Promise<string>{
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(Date.now().toString())
        },1000)
    })
}

const useGetInfo=()=>{
    const [loading,setLoading]=useState(true)
    const [info,setInfo]=useState('')

     useEffect(()=>{
        getInfo().then(info=>{
            setLoading(false)
            setInfo(info)
        }).catch(()=>{
            setLoading(false)
            setInfo('获取信息失败')
        })
     },[])
    return {loading,info}
}

export default useGetInfo
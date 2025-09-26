// 没有jsx 片段 .ts
import { useEffect } from 'react'

function useTitle(title:string){
 useEffect(()=>{
    console.log('useEffect')
    document.title=title
  },[title])
}
export default useTitle
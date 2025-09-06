import React, { FC } from 'react'
import { useNavigate,Link } from 'react-router-dom'

const Home:FC=()=>{
    // 第三方 hook
     const nav=useNavigate()

  function clickHandler(){
    nav('/login?5388484884')
  }

    return (
      <div>
        <p>Home</p>
        <div>
            <button onClick={clickHandler}>登录</button>
            <Link to='/discover?534534>'>发现</Link>
        </div>
      </div>
    )
}
export default Home
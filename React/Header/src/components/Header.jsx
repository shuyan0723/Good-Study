function Header({user,onLogout}){
  return (
    <header>
        <img src='logo.png' />
        <span>{user.name}</span>
        <button onClick={onLogout}>退出</button>
        
    </header>
  )
}

export default Header
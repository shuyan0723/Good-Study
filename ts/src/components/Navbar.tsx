// src/components/Navbar.tsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">首页</Link>
      <Link to="/about">关于我们</Link>
    </nav>
  );
}

export default Navbar;
import { Link, NavLink } from "react-router-dom";
import logoImg from "../assets/Logo.png"; 
import "./Header.css";

const Header = () => {
  return (
    <nav className="header">
      <div className="container">
        {/* روابط التنقل */}
        <div className="auth-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>
          <Link to="/register" className="register-btn">
            Sign up
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              الرئيسية
            </NavLink>
          </li>
          <li>
            <NavLink to="/plants">موسوعة النباتات</NavLink>
          </li>
          <li>
            <NavLink to="/diseases">الأمراض</NavLink>
          </li>
          <li>
            <Link to="/dashboard">نباتاتي</Link>
          </li>

        </ul>

        <div className="logo">
          <Link to="/">
            <img src={logoImg} alt="Flora Care Logo" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;

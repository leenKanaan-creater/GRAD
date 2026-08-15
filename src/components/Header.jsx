import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoImg from "../assets/Logo.png"; 
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState("");

  const checkAuth = () => {
    const currentToken = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    
    setToken(currentToken);
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserName(user?.name || user?.userName || "المستخدم");
      } catch (e) {
        setUserName("المستخدم");
      }
    } else {
      setUserName("");
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    checkAuth();
    navigate("/login");
  };

  return (
    <nav className="header">
      <div className="container">
        <div className="auth-buttons">
          {token ? (
            <div className="user-profile-section">
              <div className="user-badge">
                <svg className="user-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="user-name">{userName}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                 خروج
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Sign up</Link>
            </>
          )}
        </div>

        <ul className="nav-links">
          <li><NavLink to="/" end>الرئيسية</NavLink></li>
          <li><NavLink to="/plants">موسوعة النباتات</NavLink></li>
          <li><NavLink to="/diseases">الأمراض</NavLink></li>
          <li><NavLink to="/dashboard">نباتاتي</NavLink></li>
        </ul>

        <div className="logo">
          <Link to="/"><img src={logoImg} alt="Logo" /></Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
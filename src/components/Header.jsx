import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoImg from "../assets/Logo.png"; 
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState("");

  // متابعة التغيرات في الذاكرة لتحديث الواجهة فوراً
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setToken(storedToken);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name || parsedUser.username || "المستخدم");
      } catch (e) {
        setUserName("");
      }
    }
  }, []);

  // دالة تسجيل الخروج وتنظيف الذاكرة بالكامل
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setUserName("");
    navigate("/login");
  };

  return (
    <nav className="header">
      <div className="container">
        
        {/* أزرار التسجيل والدخول أو خيار تسجيل الخروج */}
        <div className="auth-buttons">
          {token ? (
            <div className="user-profile-actions">
              <span className="welcome-user">👤 {userName}</span>
              <button onClick={handleLogout} className="logout-btn-small">
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* روابط القائمة */}
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
          {token && (
            <li>
              <NavLink to="/dashboard">نباتاتي</NavLink>
            </li>
          )}
        </ul>

        {/* اللوجو */}
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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/plants");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-brand-section">
          <img src={logo} alt="فلورا كير - Flora Care" className="login-logo" />
          <div className="brand-statement">
            
            <p>مساحتكِ الخاصة لتعلم رعاية نباتاتكِ ومتابعتها.</p>
          </div>
        </div>

        <div className="login-form-section">
          <div className="login-header">
            <h2>تسجيل الدخول</h2>
            <p>الرجاء إدخال بيانات حسابكِ للمتابعة ورعاية نباتاتكِ</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* حقل البريد الإلكتروني */}
            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* حقل كلمة المرور */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">كلمة المرور</label>
                <a href="#forgot" className="forgot-password-link">
                  نسيت كلمة المرور؟
                </a>
              </div>
              <input
                type="password"
                id="password"
                placeholder="أدخلي كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* زر الدخول المباشر */}
            <button type="submit" className="btn-submit-login">
              تسجيل الدخول
            </button>
          </form>

          <p className="register-link-text">
            ليس لديكِ حساب بعد؟ <Link to="/register">تسجيل حساب جديد</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
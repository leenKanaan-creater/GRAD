import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. إرسال بيانات الدخول إلى سيرفر Render
      const response = await fetch("https://graduation-project-co5p.onrender.com/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }

      // 2. حفظ التوكن وبيانات المستخدم بالـ LocalStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      const userData = data.data || data.user;
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // 🔴 إطلاق حدث لتنبيه الـ Header وتحديث اسم المستخدم والتوكن فوراً دون الحاجة لتحديث الصفحة
      window.dispatchEvent(new Event("storage"));

      // 3. التوجيه لصفحة نباتاتي بعد النجاح
      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "تعذر الاتصال بالسيرفر!");
    } finally {
      setLoading(false);
    }
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

          {/* تنبيه الخطأ عند فشل الدخول */}
          {error && <div className="error-banner" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

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
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* زر الدخول */}
            <button type="submit" className="btn-submit-login" disabled={loading}>
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="register-link-text">
            ليس لديك حساب بعد؟ <Link to="/register">تسجيل حساب جديد</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
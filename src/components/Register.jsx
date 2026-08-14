import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./Register.css"; 
import logo from "../assets/Logo.png"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // 1. التحقق من الحد الأدنى لطول كلمة المرور (6 حروف)
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل! ❌");
      return;
    }

    // 2. التحقق من تطابق كلمة المرور محلياً
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين! ❌");
      return;
    }

    setLoading(true);

    try {
      // 3. إرسال البيانات مع إرفاق حقل التأكيد للباك إند
      const response = await fetch("https://graduation-project-co5p.onrender.com/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          passwordConfirm: confirmPassword, // حقل التأكيد المطلوب من قبل الـ Validator
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 
          data.errors?.[0]?.msg || 
          "حدث خطأ أثناء إنشاء الحساب"
        );
      }

      setMessage("تم إنشاء الحساب بنجاح! جاري التحويل لصفحة الدخول... 🎉");
      
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.message || "تعذر الاتصال بالسيرفر!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        
        <div className="register-brand-section">
          <img src={logo} alt="فلورا كير - Flora Care" className="register-logo" />
          <div className="brand-statement">
            <h3>منصة فلورا كير</h3>
            <p>المساحة الخاصة والمبسطة لتعلم رعاية النباتات</p>
          </div>
        </div>

        <div className="register-form-section">
          <div className="register-header">
            <h2>إنشاء حساب جديد</h2>
            <p>أدخل البيانات التالية لإنشاء الحساب الشخصي</p>
          </div>

          {/* تنبيه النجاح والخطأ */}
          {message && <div className="success-banner">{message}</div>}
          {error && <div className="error-banner" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            
            {/* حقل الاسم */}
            <div className="form-group">
              <label htmlFor="name">الاسم الكامل</label>
              <input 
                type="text" 
                id="name" 
                placeholder="مثال: أحمد محمد" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            {/* البريد الإلكتروني */}
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

            {/* كلمة المرور */}
            <div className="form-group">
              <label htmlFor="password">كلمة المرور</label>
              <input 
                type="password" 
                id="password" 
                placeholder="أدخل كلمة مرور قوية" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {/* تأكيد كلمة المرور */}
            <div className="form-group">
              <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="أعد إدخال كلمة المرور" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn-submit-register" disabled={loading}>
              {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
            </button>
          </form>

          <p className="login-link-text">
            يوجد حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
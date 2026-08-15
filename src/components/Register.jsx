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

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل! ❌");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين! ❌");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://graduation-project-co5p.onrender.com/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          passwordConfirm: confirmPassword,
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

      // 💡 إضافة جوهرية: حفظ التوكن والبيانات فوراً إذا أرجعتها استجابة السيرفر
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      setMessage("تم إنشاء الحساب بنجاح! جاري التوجيه... 🎉");
      
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // التوجيه المباشر لصفحة النباتات أو تسجيل الدخول
      setTimeout(() => {
        navigate(data.token ? "/plants" : "/login");
      }, 1500);

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

          {message && <div className="success-banner">{message}</div>}
          {error && <div className="error-banner" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            
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
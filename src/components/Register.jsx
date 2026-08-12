import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./Register.css"; 
import logo from "../assets/Logo.png"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newUser = { name, email, password };
    
    localStorage.setItem("user", JSON.stringify(newUser));
    
    setMessage("تم إنشاء حسابكِ بنجاح! جاري تحويلكِ لصفحة الدخول... 🎉");
    
    setName("");
    setEmail("");
    setPassword("");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        
        <div className="register-brand-section">
          <img src={logo} alt="فلورا كير - Flora Care" className="register-logo" />
          <div className="brand-statement">
            <h3>منصة فلورا كير</h3>
            <p>مساحتك الخاصة والمبسطة لتعلم رعاية نباتاتك</p>
          </div>
        </div>

        <div className="register-form-section">
          <div className="register-header">
            <h2>إنشاء حساب جديد</h2>
            <p>أدخلي البيانات التالية لإنشاء حسابك الشخصي</p>
          </div>

          {message && <div className="success-banner">{message}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            
            {/* حقل الاسم */}
            <div className="form-group">
              <label htmlFor="name">الاسم الكامل</label>
              <input 
                type="text" 
                id="name" 
                placeholder="مثال: سارة أحمد" 
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
                placeholder="أدخلي كلمة مرور قوية" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn-submit-register">
              إنشاء الحساب
            </button>
          </form>

          <p className="login-link-text">
            لديكِ حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
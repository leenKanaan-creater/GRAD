import { Link } from "react-router-dom";
import logoImg from "../assets/Logo.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={logoImg} alt="شعار فلورا كير" />
          <div>
            <h2>فلورا كير</h2>
            <p>دليلك البسيط لفهم النباتات والعناية بها بثقة.</p>
             <p>تم الحصول على المعلومات في الموقع من مديرية الزراعة في محافظة اللاذقية</p>
          </div>
        </div>

        <div className="footer-links-group">
          <h3>روابط سريعة</h3>
          <div className="footer-links">
            <Link to="/">الرئيسية</Link>
            <Link to="/plants">موسوعة النباتات</Link>
            <Link to="/dashboard">نباتاتي</Link>
          </div>
        </div>

        <div className="footer-note">
          <span className="footer-note-icon" aria-hidden="true">🌱</span>
          <p>ازرع المعرفة اليوم، لتحصل على نباتات أكثر صحة غداً.</p>
  
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Flora Care. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
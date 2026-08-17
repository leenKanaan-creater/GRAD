import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">FLORA CARE</span>
          <h1>دليلك البسيط والذكي <br /> للتعرف على النباتات وتفاصيلها واحتياجاتها</h1>
          <p className="hero-subtitle">
            مساحة هادئة تمنحكِ كل ما تحتاجينه لفهم احتياجات تربتكِ، رعاية نباتاتكِ اليومية، وعلاج أمراضها برفق وااحترافية.
          </p>
          <div className="hero-actions">
            <Link to="/plants" className="btn-premium-dark">تصفح الموسوعة</Link>
            <Link to="/about" className="btn-premium-light">اكتشف رحلتنا</Link>
          </div>
        </div>

        <div className="interactive-art-wrapper">
          <div className="art-glow"></div>
          
          <div className="botanical-pulse-art">
            <svg className="pulse-svg" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                className="pulse-line" 
                d="M 10,150 L 120,150 L 140,110 L 160,190 L 180,130 L 190,150 L 250,150 L 270,90 L 290,210 L 310,150 L 390,150" 
                stroke="#eef4e8" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              <path 
                className="leaf-branch"
                d="M 250,150 Q 280,100 320,120 Q 290,160 250,150 Z" 
                fill="rgba(238, 244, 232, 0.2)" 
                stroke="#eef4e8" 
                strokeWidth="2"
              />
              <path 
                className="leaf-branch-small"
                d="M 190,150 Q 170,110 140,130 Q 170,160 190,150 Z" 
                fill="rgba(200, 214, 183, 0.25)" 
                stroke="#c8d6b7" 
                strokeWidth="2"
              />
            </svg>

            <div className="floating-metric soil-status">
              <span className="metric-icon">🟫</span>
              <div className="metric-info">
                <span>رطوبة التربة</span>
                <strong>68% (مثالي)</strong>
              </div>
            </div>

            <div className="floating-metric health-status">
              <span className="metric-icon">🛡️</span>
              <div className="metric-info">
                <span>مؤشر الصحة</span>
                <strong>خالٍ من الآفات</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* أقسام الـ Services السفلية */}
      <section className="services-showcase">
        <div className="section-title-center">
          <h2>نهجنا في الرعاية</h2>
          <p>أدوات متطورة صممت لتبسيط رحلتك الزراعية</p>
        </div>

        <div className="services-grid">
          <Link to="/plants" className="service-minimal-card">
            <span className="card-number">01</span>
            <span className="card-icon">🌿</span>
            <h3>موسوعة النباتات</h3>
            <p>دليلك اليومي لتفاصيل نمو واحتياجات النباتات بدقة متناهية.</p>
            <span className="card-arrow">عرض التفاصيل ←</span>
          </Link>

          <Link to="/diseases" className="service-minimal-card">
            <span className="card-number">03</span>
            <span className="card-icon">🍂</span>
            <h3>تشخيص الأمراض</h3>
            <p>تعرف على علامات التعب والآفات مبكراً لإنقاذ نباتاتك بلطف.</p>
            <span className="card-arrow">عرض التفاصيل ←</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
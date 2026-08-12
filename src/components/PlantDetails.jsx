import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlantById, getPlantVarieties } from "../services/plantService";
import "./PlantDetails.css";

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [varieties, setVarieties] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPlant();
  }, [id]);

  const loadPlant = async () => {
    try {
      const data = await getPlantById(id);
      setPlant(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowVarieties = async () => {
    try {
      const data = await getPlantVarieties(id);
      console.log("بيانات الأصناف القادمة من الباك إند:", data);
      setVarieties(data);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      setVarieties([]);
      setShowModal(true);
    }
  };

  if (!plant) {
    return (
      <div className="details-loading-container">
        <div className="spinner"></div>
        <p className="loading">جاري تحميل معلومات النبات المفصلة...</p>
      </div>
    );
  }

  return (
    <div className="plant-details-page">
      {/* Back Navigation Bar */}
      <div className="navigation-bar">
        <button onClick={() => navigate(-1)} className="back-btn">
          <span>← العودة للموسوعة</span>
        </button>
      </div>

      {/* Main Plant Profile Card */}
      <div className="plant-profile">
        <div className="profile-image-container">
          <img src={plant.images?.[0]?.url} alt={plant.common_name} />
          <span className="profile-category-badge">🌿 {plant.category}</span>
        </div>

        <div className="plant-title-section">
          <h1>{plant.common_name}</h1>
          <h3>{plant.scientific_name}</h3>
          <p className="plant-family-tag">
            🌿 عائلة النبات: {plant.family || "غير محددة"}
          </p>
        </div>
      </div>

      <div className="quick-info">
        {/* <div className="info-card water-card">
          <div className="info-icon-wrapper">💧</div>
          <h4>جدول الري</h4>
          <p>{plant.water_requirement}</p>
        </div> */}
        <div className="info-card water-card">
          <div className="info-icon-wrapper">💧</div>
          <h4>جدول الري</h4>

          <p>
            كل {plant.watering_frequency_days} أيام
          </p>

          <span>
            مستوى الحاجة للماء: {plant.water_requirement}
          </span>
        </div>

        <div className="info-card light-card">
          <div className="info-icon-wrapper">☀️</div>
          <h4>متطلبات الإضاءة</h4>
          <p>{plant.light_requirement}</p>
        </div>

        <div className="info-card temp-card">
          <div className="info-icon-wrapper">🌡️</div>
          <h4>درجة الحرارة المثالية</h4>
          <p className="temp-range">
            {plant.temperature_range?.min} - {plant.temperature_range?.max} °C
          </p>
        </div>
        <div className="info-card yield-card">
          <div className="info-icon-wrapper">🌾</div>
          <h4>متوسط الإنتاج</h4>
          <p>{plant.average_yield || "غير متوفر"}</p>
        </div>
      </div>

      {/* Details Sections Grid */}
      <div className="details-content">
        <div className="details-box info-box">
          <h2>📖 تفاصيل الزراعة والنمو</h2>

          <div className="detail-item">
            <strong>العائلة النباتية:</strong>
            <p>{plant.family}</p>
          </div>

          <div className="detail-item">
            <strong>موسم الزراعة المفضل:</strong>
            <p>{plant.planting_season}</p>
          </div>

          <div className="detail-item">
            <strong>فترة وفصل النمو:</strong>
            <p>{plant.growth_period}</p>
          </div>
        </div>

        <div className="details-box conditions-box">
          <h2>🌱 ملاءمة البيئة والتربة</h2>

          <div className="detail-item">
            <strong>تحمل الجفاف والحرارة:</strong>
            <p>{plant.drought_tolerance}</p>
          </div>

          <div className="detail-item">
            <strong>تحمل الصقيع والبرودة:</strong>
            <p>{plant.frost_tolerance}</p>
          </div>

          <div className="detail-item">
            <strong>درجة حموضة التربة المفضلة (pH):</strong>
            <p className="ph-range-badge">
              {plant.ph_range?.min} - {plant.ph_range?.max} pH
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-footer">
        <button
          className="varieties-premium-button"
          onClick={handleShowVarieties}
        >
          <span>تصفح أصناف النبات</span>
          <span className="btn-icon">🍃</span>
        </button>

        <button className="follow-plant-button">
          <span>أضف إلى نباتاتي</span>
          <span className="btn-icon">🌱</span>
        </button>
      </div>

      {/* Modal الأصناف ويحتوي على الصور */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal-btn"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <div className="modal-header">
              <h2>أصناف {plant.common_name}</h2>
              <p>تصفح الاصناف لهذا النبات</p>
            </div>

            {varieties.length === 0 ? (
              <div className="empty-message-box">
                <span className="empty-icon">📂</span>
                <p>عذرًا، سيتم إضافة أصناف قريباً لهذا النبات.!</p>
              </div>
            ) : (
              <div className="varieties-grid">
                {varieties.map((item) => (
                  <div className="variety-card" key={item._id}>
                    <div className="variety-image-wrapper">
                      <img
                        src={
                          item.images?.[0]?.url ||
                          item.image ||
                          "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=500"
                        }
                        alt={item.common_name}
                        style={{
                          width: "100%",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "8px",
                        }}
                      />
                    </div>

                    <h3>{item.common_name}</h3>
                    <p className="variety-title">نوع السلالة</p>
                    <span
                      className={
                        item.type === "local" ? "badge-local" : "badge-imported"
                      }
                    >
                      {item.type === "local" ? "📍 محلي" : "🌐 مستورد"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDetails;

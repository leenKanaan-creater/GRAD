import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlants, getPlantVarieties } from "../services/plantService";
import "./Plants.css";

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [varieties, setVarieties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState("");

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      setLoading(true);
      const data = await getPlants();
      setPlants(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const showVarieties = async (plantId, plantName) => {
    try {
      const data = await getPlantVarieties(plantId);
      setSelectedPlant(plantName);
      setVarieties(data);
      setShowModal(true);
    } catch (error) {
      setSelectedPlant(plantName);
      setVarieties([]);
      setShowModal(true);
    }
  };

  const categories = [
    { key: "all", title: "🌿 الكل" },
    { key: "fruit", title: "🍎 الفواكه" },
    { key: "vegetables", title: "🥦 الخضار" },
    { key: "اعشاب", title: "🍃 الأعشاب" },
    { key: "cereals", title: "🌾 الحبوب" },
    { key: "oil", title: "🌻 نباتات زيتية" },
    { key: "fiber", title: "🧶 نباتات ليفية" },
    { key: "زينة", title: "🌸 نباتات الزينة" },
  ];

  const filteredPlants = plants.filter((plant) => {
    if (selectedCategory === "all") return true;
    return plant.category === selectedCategory;
  });

  return (
    <div className="plants-page">
      {/* Header Section */}
      <header className="plants-header">
        <h1>موسوعة النباتات</h1>
        <p className="subtitle">
          اكتشف عالم النباتات ، و أصنافها و تفاصيلها لتتعلم عنايتها 
        </p>
      </header>

      {/* Categories Tabs */}
      <div className="categories-container">
        <div className="categories-buttons">
          {categories.map((category) => (
            <button
              key={category.key}
              className={
                selectedCategory === category.key ? "active-category" : ""
              }
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>جاري التحميل ...</p>
        </div>
      ) : (
        /* Plants Grid */
        <div className="plants-grid">
          {filteredPlants.map((plant) => (
            <div className="plant-card" key={plant._id}>
              <div className="plant-image-wrapper">
                <img
                  src={
                    plant.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=500"
                  }
                  alt={plant.common_name}
                />
                <span className="card-category-badge">🌿 {plant.category}</span>
              </div>

              <div className="plant-info">
                <h3>{plant.common_name}</h3>

                <p className="scientific-name">
                  <span>الاسم العلمي:</span> {plant.scientific_name}
                </p>

                <div className="card-footer-action-bar">
                 <Link
  to={`/plants/${plant._id || plant.id}`} // 👈 يضمن اختيار المعرف المتاح
  className="premium-btn-primary"
>
                    <span>استكشف التفاصيل</span>
                    <i className="btn-arrow">←</i>
                  </Link>

                  <button
                    className="premium-btn-secondary-icon"
                    onClick={() => showVarieties(plant._id, plant.common_name)}
                    title="أصناف النبات"
                  >
                    🍃
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
              <h2>أصناف {selectedPlant}</h2>
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
                    {/* 🛠️ تم إضافة حاوية الصورة هنا لتعرض الصورة داخل الموسوعة أيضاً */}
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

export default Plants;

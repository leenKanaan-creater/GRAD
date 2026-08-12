 import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getPlants, getPlantDiseases } from "../services/plantService";
import "./Diseases.css";
const diseaseFAQs = [
  {
    question: "كيف أعرف أن نباتي مصاب بمرض؟",
    answer:
      "يمكن ملاحظة الإصابة من خلال ظهور بقع على الأوراق، تغير لون النبات، الذبول، أو ضعف النمو بشكل غير طبيعي."
  },

  {
    question: "هل اصفرار أوراق النبات يعني وجود مرض دائمًا؟",
    answer:
      "ليس بالضرورة، فقد يكون السبب نقص العناصر الغذائية، زيادة أو نقص الري، أو عدم توفر الإضاءة المناسبة."
  },

  {
    question: "كيف يمكن الوقاية من أمراض النباتات؟",
    answer:
      "تتم الوقاية من خلال توفير الظروف المناسبة للنبات، تحسين التهوية، تنظيم الري، تنظيف الأدوات الزراعية وإزالة الأجزاء المصابة."
  },

  {
    question: "هل تنتقل أمراض النباتات بين النباتات؟",
    answer:
      "نعم، بعض الأمراض يمكن أن تنتقل عن طريق الهواء، الحشرات، التربة، أو استخدام أدوات ملوثة."
  },

  {
    question: "متى أستخدم علاجًا أو مبيدًا للنبات؟",
    answer:
      "يفضل تحديد نوع المرض أولًا ثم استخدام العلاج المناسب، لأن الاستخدام العشوائي قد يضر النبات."
  }
];

const Diseases = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [loadingDiseases, setLoadingDiseases] = useState(false);

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

  const showDiseases = async (plant) => {
    try {
      setLoadingDiseases(true);
      const data = await getPlantDiseases(plant._id);
      console.log("Diseases API:", data);
      setSelectedPlant(plant.common_name);
 setDiseases(data || []);
      setShowModal(true);

    } catch (error) {
      console.log(error);
      setDiseases([]);
      setShowModal(true);

    } finally {
      setLoadingDiseases(false);
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
    <div className="diseases-page">
      <header className="diseases-header">
        <h1>
          أمراض النباتات 🩺
        </h1>
        <p>
          تعرف على الأمراض الشائعة التي تصيب النباتات
          وطرق الوقاية والعلاج.
        </p>
      </header>

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
      {
        loading ? (
          <div className="loading-container">
            <div className="spinner"></div>

            <p>
              جاري تحميل النباتات...
            </p>

          </div>
        ) : (
          <div className="diseases-grid">
            {
              filteredPlants.map((plant) => (

                <div
                  className="disease-plant-card"
                  key={plant._id}
                >
                  <div className="disease-image-wrapper">

                    <img
                      src={
                        plant.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1545241047-6083a3684587"
                      }
                      alt={plant.common_name}
                    />
                    <span className="card-category-badge">
                      🌿 {plant.category}
                    </span>
                  </div>
                  <div className="disease-card-content">

                    <h3>
                      {plant.common_name}
                    </h3>

                    <p className="scientific-name">

                      <span>
                        الاسم العلمي:
                      </span>

                      <br />

                      {plant.scientific_name}

                    </p>

                    <button
                      onClick={() => showDiseases(plant)}
                    >

                      🩺 عرض الأمراض

                    </button>

                  </div>

                </div>

              ))
            }

          </div>

        )
      }

      {
        showModal && (

          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >

            <div
              className="disease-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal-btn"
                onClick={() => setShowModal(false)}
              >
                ✖️
              </button>

              <h2>
                أمراض {selectedPlant} 🌿
              </h2>

              <p className="modal-subtitle">
                الأمراض المحتملة وطرق التعامل معها
              </p>

              <div className="disease-list">

                {
                  loadingDiseases ? (

                    <p className="no-disease">
                      جاري تحميل الأمراض...
                    </p>

                  ) : !diseases || diseases.length === 0 ? (
 <p className="no-disease">
                      🌱 سيتم إضافة أمراض لهذا النبات لاحقًا.
                    </p>

                  ) : (

                    diseases.map((disease, index) => (

                      <div
                        className="disease-item"
                        key={index}
                      >
                        {disease.image?.url ? (
                          <img
                            src={disease.image.url}
                            alt={disease.name}
                            className="disease-image"
                          />
                        ) : (
                          <div className="disease-placeholder">
                            🌿
                            <span>لا توجد صورة لهذا المرض</span>
                          </div>
                        )}
                        <h3>
                          🦠 {disease.name}
                        </h3>

                        <p>
                          <strong>نوع المرض:</strong>
                          <br />
                          {disease.diseasestype}
                        </p>

                        <p>
                          <strong>درجة الخطورة:</strong>
                          <br />
                          {disease.susceptibility}
                        </p>

                        <p>
                          <strong>الأعراض:</strong>
                          <br />
                          {disease.symptoms}
                        </p>

                        <p>
                          <strong>الوقاية:</strong>
                          <br />
                          {disease.prevention}
                        </p>

                        <p>
                          <strong>العلاج:</strong>
                          <br />
                          {disease.treatment}
                        </p>

                        <p>
                          <strong>موسم الانتشار:</strong>
                          <br />
                          {disease.peak_season}
                        </p>

                      </div>

                    ))

                  )
                }

              </div>

            </div>

          </div>

        )
      }
      <section className="disease-faq">
        <div className="faq-header">
          <h2>
            أسئلة شائعة حول أمراض النباتات 🩺
          </h2>
          <p>
            معلومات تساعدك على العناية بنباتاتك 🌱
          </p>
        </div>
        <div className="faq-list">
          {diseaseFAQs.map((item, index) => (
            <div className="faq-item" key={index}>
              <button
                onClick={() =>
                  setOpenQuestion(
                    openQuestion === index ? null : index
                  )
                }
              >
                <span>
                  {item.question}
                </span>

                <span>
                  {openQuestion === index ? "−" : "+"}
                </span>

              </button>

              {
                openQuestion === index && (
                  <p>
                    {item.answer}
                  </p>
                )
              }

            </div>

          ))}

        </div>

      </section>
    </div>
  );
};
export default Diseases;
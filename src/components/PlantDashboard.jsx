import React, { useState, useEffect } from "react";
import { getPlants, getPlantDiseases } from "../services/plantService";
import {
  getUserPlants,
  addUserPlant,
  getPlantSoils,
  updateUserPlant,
  deleteUserPlant,
} from "../services/userPlantService";
import "./PlantDashboard.css";

const PlantDashboard = () => {
  const [allPlants, setAllPlants] = useState([]);
  const [userPlants, setUserPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [plantToAdd, setPlantToAdd] = useState(null);
  const [addFormData, setAddFormData] = useState({
    location: "الشرفة",
    last_watering_date: new Date().toISOString().split("T")[0],
    planting_date: new Date().toISOString().split("T")[0],
  });

  // نافذة عرض التفاصيل الشاملة
  const [selectedUserPlant, setSelectedUserPlant] = useState(null);
  const [soilDetails, setSoilDetails] = useState(null);
  const [loadingSoil, setLoadingSoil] = useState(false);
  const [plantDiseases, setPlantDiseases] = useState([]);
  const [loadingDiseases, setLoadingDiseases] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

 
  const getImageUrl = (imgSource) => {
    if (!imgSource) return null;
    if (typeof imgSource === "string") return imgSource;
    if (Array.isArray(imgSource) && imgSource.length > 0) {
      return getImageUrl(imgSource[0]);
    }
    if (typeof imgSource === "object") {
      return imgSource.url || imgSource.secure_url || imgSource.path || null;
    }
    return null;
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [plantsRes, userPlantsRes] = await Promise.all([
        getPlants(),
        getUserPlants(),
      ]);

      const rawPlants = Array.isArray(plantsRes?.data || plantsRes)
        ? plantsRes?.data || plantsRes
        : [];
      const rawUsers = Array.isArray(userPlantsRes?.data || userPlantsRes)
        ? userPlantsRes?.data || userPlantsRes
        : [];

      const uniqueAllPlants = [];
      const seenCatalogIds = new Set();
      for (const p of rawPlants) {
        if (p && p._id && !seenCatalogIds.has(p._id.toString())) {
          seenCatalogIds.add(p._id.toString());
          uniqueAllPlants.push(p);
        }
      }

      const uniqueUserPlants = [];
      const seenPlantIds = new Set();

      for (const item of rawUsers) {
        const pId = item.plant_id?._id || item.plant_id;

        if (pId && !seenPlantIds.has(pId.toString())) {
          seenPlantIds.add(pId.toString());
          const fullPlant = uniqueAllPlants.find(
            (p) => p._id?.toString() === pId?.toString(),
          );
          uniqueUserPlants.push({
            ...item,
            plantData:
              fullPlant ||
              (typeof item.plant_id === "object" ? item.plant_id : {}),
          });
        }
      }

      setAllPlants(uniqueAllPlants);
      setUserPlants(uniqueUserPlants);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (plant) => {
    const isAdded = userPlants.some((item) => {
      const existingId =
        item.plantData?._id || item.plant_id?._id || item.plant_id;
      return existingId?.toString() === plant._id?.toString();
    });

    if (isAdded) {
      alert(`النبتة "${plant.common_name || plant.name}" مضافة مسبقاً!`);
      return;
    }

    setPlantToAdd(plant);
    setAddFormData({
      location: "الشرفة",
      last_watering_date: new Date().toISOString().split("T")[0],
      planting_date: new Date().toISOString().split("T")[0],
    });
  };

  const handleConfirmAddPlant = async (e) => {
    e.preventDefault();
    if (!plantToAdd) return;

    try {
      setAddingId(plantToAdd._id);

      await addUserPlant(plantToAdd._id, {
        location: addFormData.location,
        planting_date: addFormData.planting_date,
        last_watering_date: addFormData.last_watering_date,
      });

      setPlantToAdd(null);
      await loadDashboardData();
    } catch (err) {
      console.error("خطأ الإضافة:", err);
      alert("حدث خطأ أثناء حفظ النبتة واحتساب الجدول.");
    } finally {
      setAddingId(null);
    }
  };

  const handleOpenDetails = async (item) => {
    setSelectedUserPlant(item);
    setSoilDetails(null);
    setPlantDiseases([]);

    const plantId = item.plantData?._id || item.plant_id?._id || item.plant_id;

    if (!plantId) return;

    // جلب بيانات التربة
    try {
      setLoadingSoil(true);
      const soilRes = await getPlantSoils(plantId);
      const soilData = soilRes?.data || soilRes;

      if (Array.isArray(soilData) && soilData.length > 0) {
        setSoilDetails(soilData[0]);
      } else if (
        soilData &&
        typeof soilData === "object" &&
        !Array.isArray(soilData)
      ) {
        setSoilDetails(soilData);
      }
    } catch (err) {
      console.error("خطأ جلب بيانات التربة:", err);
    } finally {
      setLoadingSoil(false);
    }

    // جلب بيانات الأمراض
    try {
      setLoadingDiseases(true);
      const diseasesRes = await getPlantDiseases(plantId);
      const rawDiseases = diseasesRes?.data || diseasesRes;
      setPlantDiseases(Array.isArray(rawDiseases) ? rawDiseases : []);
    } catch (err) {
      console.error("خطأ جلب الأمراض:", err);
      setPlantDiseases([]);
    } finally {
      setLoadingDiseases(false);
    }
  };

  const handleUpdateStatus = async (userPlantId, newStatus) => {
    try {
      await updateUserPlant(userPlantId, { Status: newStatus });
      setUserPlants((prev) =>
        prev.map((item) =>
          item._id === userPlantId || item.userPlant?._id === userPlantId
            ? { ...item, Status: newStatus }
            : item,
        ),
      );
      if (selectedUserPlant) {
        setSelectedUserPlant((prev) => ({ ...prev, Status: newStatus }));
      }
    } catch (err) {
      console.error("خطأ التحديث:", err);
    }
  };

  // دالة حذف النبتة
  const handleDeletePlant = async (userPlantId) => {
    const confirmDelete = window.confirm(
      "هل أنت متأكدة من إزالة هذه النبتة من حديقتكِ؟",
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(userPlantId);
      await deleteUserPlant(userPlantId);

      setUserPlants((prev) =>
        prev.filter(
          (item) => (item._id || item.userPlant?._id) !== userPlantId,
        ),
      );
      setSelectedUserPlant(null);
    } catch (err) {
      console.error("خطأ أثناء حذف النبتة:", err);
      alert("حدث خطأ أثناء محاولة حذف النبتة.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner"></div>
        <p>جاري تحميل البيانات والتفاصيل الشاملة... 🌿</p>
      </div>
    );
  }

  return (
    <div className="dash-wrapper">
      {/* 🪴 1. قسم نباتاتي */}
      <section className="dash-section">
        <div className="section-header">
          <h2>🪴 نباتاتي ({userPlants.length})</h2>
          <p className="section-subtitle">
            اضغط على أي نبتة لمشاهدة الجدول المحسوب ودراسة التربة والأمراض
            كاملة
          </p>
        </div>

        {userPlants.length === 0 ? (
          <div className="dash-empty-card">
            <p>
              لم تقوم بإضافة أي نبتة بعد. اختار من النباتات المتاحة
              بالأسفل! ✨
            </p>
          </div>
        ) : (
          <div className="horizontal-scroll-container">
            {userPlants.map((item) => {
              const plantObj = item.plantData || {};
              const userPlantId = item._id || item.userPlant?._id;
              const plantImg =
                getImageUrl(plantObj?.images) ||
                getImageUrl(plantObj?.image) ||
                "https://via.placeholder.com/150";
              const plantName =
                plantObj?.common_name || plantObj?.name || "نبتتي";

              return (
                <div
                  key={userPlantId}
                  className="my-plant-chip-card"
                  onClick={() => handleOpenDetails(item)}
                >
                  <div className="chip-img-wrapper">
                    <img src={plantImg} alt={plantName} />
                    <span className="chip-status-tag">
                      {item.Status || "جيد"}
                    </span>
                  </div>
                  <div className="chip-details">
                    <h4>{plantName}</h4>
                    <span className="chip-action">التقرير والتربة 🔍</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 🔔 2. مواعيد الري والتسميد القادمة */}
      {userPlants.length > 0 && (
        <section className="dash-section reminders-section">
          <div className="section-header">
            <h2>🔔 مواعيد الري والتسميد القادمة</h2>
            <p className="section-subtitle">جدول تنبيهات المتابعة الدوري</p>
          </div>

          <div className="reminders-grid">
            {userPlants.map((item) => {
              const plantName =
                item.plantData?.common_name || item.plantData?.name || "نبتتك";
              const nextWater =
                item.next_watering_date || item.water?.next_watering_date;
              const nextFert =
                item.next_fertilizing_date ||
                item.fertilizer?.next_fertilizing_date;
              const userPlantId = item._id || item.userPlant?._id;

              if (!nextWater && !nextFert) return null;

              return (
                <div
                  key={userPlantId}
                  className="reminder-card"
                  onClick={() => handleOpenDetails(item)}
                >
                  <div className="reminder-header">
                    <h4>🌱 {plantName}</h4>
                    <span className="reminder-badge">
                      {item.Status || "جيد"}
                    </span>
                  </div>

                  <div className="reminder-body">
                    {nextWater && (
                      <div className="reminder-item water-item">
                        <span>💧 الري القادم:</span>
                        <strong>
                          {new Date(nextWater).toLocaleDateString("ar-EG")}
                        </strong>
                      </div>
                    )}
                    {nextFert && (
                      <div className="reminder-item fert-item">
                        <span>🧪 التسميد القادم:</span>
                        <strong>
                          {new Date(nextFert).toLocaleDateString("ar-EG")}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. إضافة نباتات جديدة */}
      <section className="dash-section">
        <div className="section-header">
          <h2>🌱 إضافة نباتات جديدة لمجموعتك</h2>
        </div>

        <div className="catalog-grid">
          {allPlants.map((plant) => {
            const imgUrl =
              getImageUrl(plant?.images) ||
              getImageUrl(plant?.image) ||
              "https://via.placeholder.com/150";
            const name = plant.common_name || plant.name || "نبتة";

            const isAdded = userPlants.some((item) => {
              const existingId =
                item.plantData?._id || item.plant_id?._id || item.plant_id;
              return existingId?.toString() === plant._id?.toString();
            });

            return (
              <div className="catalog-card" key={plant._id}>
                <div className="catalog-img-box">
                  <img src={imgUrl} alt={name} />
                </div>
                <div className="catalog-info">
                  <h4>{name}</h4>
                  <button
                    className={`catalog-add-btn ${isAdded ? "added" : ""}`}
                    onClick={() => handleOpenAddModal(plant)}
                    disabled={isAdded || addingId === plant._id}
                  >
                    {addingId === plant._id
                      ? "..."
                      : isAdded
                        ? "مضافة مسبقاً ✔️"
                        : "➕ إضافة لنباتاتي"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. مودال إضافة نبتة */}
      {plantToAdd && (
        <div className="dash-modal-overlay" onClick={() => setPlantToAdd(null)}>
          <div
            className="dash-modal-content add-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dash-modal-close"
              onClick={() => setPlantToAdd(null)}
            >
              ×
            </button>

            <div className="modal-header-info">
              <h3>إضافة نبتة: {plantToAdd.common_name || plantToAdd.name}</h3>
              <p className="modal-subtext">
                الرجاء تحديد التواريخ لحساب الجدول أوتوماتيكياً عبر الـ Backend.
              </p>
            </div>

            <form onSubmit={handleConfirmAddPlant} className="add-plant-form">
              <div className="form-group">
                <label>📍 مكان الزراعة:</label>
                <select
                  value={addFormData.location}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, location: e.target.value })
                  }
                >
                  <option value="الشرفة">الشرفة 🪴</option>
                  <option value="الحديقة">الحديقة 🌳</option>
                  <option value="داخل المنزل">داخل المنزل 🏠</option>
                  <option value="السطح">السطح ☀️</option>
                </select>
              </div>

              <div className="form-group">
                <label>📅 تاريخ بداية الزراعة:</label>
                <input
                  type="date"
                  required
                  value={addFormData.planting_date}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      planting_date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>💧 تاريخ آخر رية:</label>
                <input
                  type="date"
                  required
                  value={addFormData.last_watering_date}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      last_watering_date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="confirm-add-btn"
                  disabled={addingId === plantToAdd._id}
                >
                  {addingId === plantToAdd._id
                    ? "جاري الحفظ..."
                    : "حفظ وإضافة للنباتات"}
                </button>
                <button
                  type="button"
                  className="cancel-add-btn"
                  onClick={() => setPlantToAdd(null)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📑 5. النافذة التفصيلية (المودال) */}
      {selectedUserPlant && (
        <div
          className="dash-modal-overlay"
          onClick={() => setSelectedUserPlant(null)}
        >
          <div
            className="dash-modal-content mega-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dash-modal-close"
              onClick={() => setSelectedUserPlant(null)}
            >
              ×
            </button>

            <div className="modal-header-info">
              <h3>
                {selectedUserPlant.plantData?.common_name ||
                  selectedUserPlant.plantData?.name}
              </h3>
              {selectedUserPlant.plantData?.scientific_name && (
                <span className="sci-tag">
                  الاسم العلمي:{" "}
                  <i>{selectedUserPlant.plantData.scientific_name}</i>
                </span>
              )}
              {selectedUserPlant.plantData?.family && (
                <span className="sci-tag family-tag">
                  العائلة: {selectedUserPlant.plantData.family}
                </span>
              )}
            </div>

            <div className="modal-grid-body">
              {selectedUserPlant.plantData && (
                <div className="modal-card-box full-width">
                  <h4>📖 نبذة ومعلومات علمية:</h4>
                  <div className="description-text">
                    <p><strong>🗓 موسم الزراعة:</strong> {selectedUserPlant.plantData.planting_season || "غير محدد"}</p>
                    <p><strong>⏳ فترة النمو:</strong> {selectedUserPlant.plantData.growth_period || "غير محدد"}</p>
                    <p><strong>🪴 التربة المفضلة:</strong> {selectedUserPlant.plantData.preferred_siol || selectedUserPlant.plantData.preferred_soil || "غير محدد"}</p>
                    <p><strong>☀️ متطلبات الإضاءة:</strong> {selectedUserPlant.plantData.light_requirement || "غير محدد"}</p>
                  </div>

                  <div className="mini-info-tags">
                    {selectedUserPlant.plantData.category && (
                      <span className="info-pill">
                        🏷 التصنيف: {selectedUserPlant.plantData.category}
                      </span>
                    )}
                    {selectedUserPlant.plantData.sunlight && (
                      <span className="info-pill">
                        ☀️ الشمس:{" "}
                        {Array.isArray(selectedUserPlant.plantData.sunlight)
                          ? selectedUserPlant.plantData.sunlight.join(" / ")
                          : selectedUserPlant.plantData.sunlight}
                      </span>
                    )}
                    {selectedUserPlant.plantData.watering_period && (
                      <span className="info-pill">
                        💧 دورة الري:{" "}
                        {selectedUserPlant.plantData.watering_period}
                      </span>
                    )}
                    {selectedUserPlant.plantData.growth_rate && (
                      <span className="info-pill">
                        📈 معدل النمو: {selectedUserPlant.plantData.growth_rate}
                      </span>
                    )}
                    {selectedUserPlant.plantData.cycle && (
                      <span className="info-pill">
                        🔄 دورة الحياة: {selectedUserPlant.plantData.cycle}
                      </span>
                    )}
                    {selectedUserPlant.plantData.pruning && (
                      <span className="info-pill">
                        ✂️ التقليم: {selectedUserPlant.plantData.pruning}
                      </span>
                    )}
                    {selectedUserPlant.plantData.temperature && (
                      <span className="info-pill">
                        🌡 الحرارة المناسبة:{" "}
                        {selectedUserPlant.plantData.temperature}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* سجل النبتة */}
              <div className="modal-card-box">
                <h4>📌 سجل النبتة وحالتها لدى المستخدم:</h4>
                <div className="details-list">
                  <p>
                    <strong>تاريخ بداية الزراعة:</strong>{" "}
                    {selectedUserPlant.planting_date
                      ? new Date(
                          selectedUserPlant.planting_date,
                        ).toLocaleDateString("ar-EG")
                      : "غير محدد"}
                  </p>
                  <p>
                    <strong>مكان الزراعة:</strong>{" "}
                    {selectedUserPlant.location || "الشرفة / الحديقة"}
                  </p>
                  {selectedUserPlant.actual_yield && (
                    <p>
                      <strong>الإنتاج الفعلي المتوقع:</strong>{" "}
                      {selectedUserPlant.actual_yield} كغ
                    </p>
                  )}
                  <div className="modal-status-picker">
                    <strong>تحديث الحالة الحالية:</strong>
                    <select
                      value={selectedUserPlant.Status || "جيد"}
                      onChange={(e) =>
                        handleUpdateStatus(
                          selectedUserPlant._id ||
                            selectedUserPlant.userPlant?._id,
                          e.target.value,
                        )
                      }
                    >
                      <option value="جيد">جيد 🌿</option>
                      <option value="ذابل">ذابل 🍂</option>
                      <option value="مريض">مريض ⚠️</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-card-box highlight-blue">
                <h4>💧 جدول الري التلقائي:</h4>
                <div className="details-list">
                  <p>
                    <strong>تاريخ آخر رية:</strong>{" "}
                    {selectedUserPlant.last_watering_date
                      ? new Date(
                          selectedUserPlant.last_watering_date,
                        ).toLocaleDateString("ar-EG")
                      : "غير مسجل"}
                  </p>
                  <p>
                    <strong>تاريخ الري القادم (المحسوب):</strong>{" "}
                    <span className="highlight-text">
                      {selectedUserPlant.next_watering_date
                        ? new Date(
                            selectedUserPlant.next_watering_date,
                          ).toLocaleDateString("ar-EG")
                        : selectedUserPlant.water?.next_watering_date
                          ? new Date(
                              selectedUserPlant.water.next_watering_date,
                            ).toLocaleDateString("ar-EG")
                          : "قيد الحساب من السيرفر..."}
                    </span>
                  </p>
                </div>
              </div>

              <div className="modal-card-box highlight-green">
                <h4>🧪 جدول التسميد التلقائي:</h4>
                <div className="details-list">
                  <p>
                    <strong>تاريخ بداية الزراعة:</strong>{" "}
                    {selectedUserPlant.planting_date
                      ? new Date(
                          selectedUserPlant.planting_date,
                        ).toLocaleDateString("ar-EG")
                      : "غير مسجل"}
                  </p>
                  <p>
                    <strong>تاريخ التسميد القادم:</strong>{" "}
                    <span className="highlight-text">
                      {selectedUserPlant.next_fertilizing_date
                        ? new Date(
                            selectedUserPlant.next_fertilizing_date,
                          ).toLocaleDateString("ar-EG")
                        : selectedUserPlant.fertilizer?.next_fertilizing_date
                          ? new Date(
                              selectedUserPlant.fertilizer
                                .next_fertilizing_date,
                            ).toLocaleDateString("ar-EG")
                          : "قيد الحساب من السيرفر..."}
                    </span>
                  </p>
                </div>
              </div>

              <div className="modal-card-box highlight-soil full-width">
                <h4>🌱 دراسة التربة وخصائصها التفصيلية الكاملة:</h4>
                {loadingSoil ? (
                  <p className="no-data">
                    جاري جلب تفاصيل وخصائص التربة الموصى بها...
                  </p>
                ) : soilDetails ? (
                  <div className="details-list">
                    <p>
                      <strong>اسم نوع التربة الموصى به:</strong>{" "}
                      {soilDetails.name ||
                        soilDetails.soil_name ||
                        "تربة مخصصة"}{" "}
                      (
                      {soilDetails.types ||
                        soilDetails.type ||
                        "مثالي لجذور النبتة"}
                      )
                    </p>
                    {soilDetails.description && (
                      <p>
                        <strong>الوصف الزراعي للتربة:</strong>{" "}
                        {soilDetails.description}
                      </p>
                    )}

                    {(soilDetails.phlevel ||
                      soilDetails.properties?.ph_level ||
                      soilDetails.ph_level) && (
                      <p>
                        <strong>درجة الحموضة المناسبة (pH):</strong> من{" "}
                        <span className="badge-val">
                          {soilDetails.phlevel?.min ??
                            soilDetails.properties?.ph_level?.min ??
                            soilDetails.ph_level?.min ??
                            "6.0"}
                        </span>{" "}
                        إلى{" "}
                        <span className="badge-val">
                          {soilDetails.phlevel?.max ??
                            soilDetails.properties?.ph_level?.max ??
                            soilDetails.ph_level?.max ??
                            "7.5"}
                        </span>
                      </p>
                    )}

                    {(soilDetails.properties || soilDetails) && (
                      <div className="soil-grid-props">
                        <div className="prop-item">
                          <span>💧 مستوى الرطوبة:</span>
                          <strong>
                            {soilDetails.properties?.moisture_level ||
                              soilDetails.moisture_level ||
                              "متوسط"}
                          </strong>
                        </div>
                        <div className="prop-item">
                          <span>🏞 نفاذية وتصريف المياه:</span>
                          <strong>
                            {soilDetails.properties?.drainage ||
                              soilDetails.drainage ||
                              "جيد"}
                          </strong>
                        </div>
                        <div className="prop-item">
                          <span>🍂 نسبة المواد العضوية:</span>
                          <strong>
                            {soilDetails.properties?.organicMatter ||
                              soilDetails.properties?.organic_matter ||
                              soilDetails.organic_matter ||
                              "غنية جداً"}
                          </strong>
                        </div>
                        <div className="prop-item">
                          <span>🏺 قوام ملمس التربة:</span>
                          <strong>
                            {soilDetails.properties?.texture ||
                              soilDetails.texture ||
                              "متوسط الحبيبات"}
                          </strong>
                        </div>
                        <div className="prop-item">
                          <span>🌧 المعدل الموصى به للرطوبة:</span>
                          <strong>
                            {soilDetails.properties?.rainfall ||
                              soilDetails.rainfall ||
                              "معتدل"}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="no-data">
                    لا توجد دراسة تربة مسجلة لهذه النبتة.
                  </p>
                )}
              </div>

              {/* الأمراض المحتملة للنبتة */}
              <div className="modal-card-box full-width">
                <h4>🩺 الأمراض المحتملة للنبتة:</h4>
                {loadingDiseases ? (
                  <p className="no-data">جاري تحميل الأمراض...</p>
                ) : !plantDiseases || plantDiseases.length === 0 ? (
                  <p className="no-data">
                    🌱 لا توجد أمراض مسجلة حاليًا لهذه النبتة.
                  </p>
                ) : (
                  <div className="dashboard-diseases-grid">
                    {plantDiseases.map((disease, index) => {
                      const imgUrl =
                        disease.image?.url ||
                        getImageUrl(disease.image) ||
                        getImageUrl(disease.images);

                      return (
                        <div className="dashboard-disease-card" key={index}>
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={disease.name}
                              className="disease-image"
                            />
                          ) : (
                            <div className="disease-placeholder">
                              🌿
                              <span>لا توجد صورة لهذا المرض</span>
                            </div>
                          )}

                          <h5>🦠 {disease.name}</h5>
                          <div className="disease-info-box">
                            <p>
                              <strong>🧬 نوع المرض:</strong>
                              <br />
                              {disease.diseasestype ||
                                disease.type ||
                                "غير محدد"}
                            </p>
                            <p>
                              <strong>⚠️ درجة الخطورة:</strong>
                              <br />
                              {disease.susceptibility || "غير محدد"}
                            </p>
                            <p>
                              <strong>🔍 الأعراض:</strong>
                              <br />
                              {disease.symptoms || "غير مسجلة"}
                            </p>
                            <p>
                              <strong>🛡 الوقاية:</strong>
                              <br />
                              {disease.prevention || "غير مسجلة"}
                            </p>
                            <p>
                              <strong>💊 العلاج:</strong>
                              <br />
                              {disease.treatment || "غير مسجل"}
                            </p>
                            <p>
                              <strong>🌦 موسم الانتشار:</strong>
                              <br />
                              {disease.peak_season || "طوال العام"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 🔻 قسم حذف النبتة 🔻 */}
              <div className="modal-card-box full-width modal-delete-footer">
                <button
                  className="delete-plant-btn"
                  onClick={() =>
                    handleDeletePlant(
                      selectedUserPlant._id || selectedUserPlant.userPlant?._id,
                    )
                  }
                  disabled={
                    deletingId ===
                    (selectedUserPlant._id || selectedUserPlant.userPlant?._id)
                  }
                >
                  {deletingId === (selectedUserPlant._id || selectedUserPlant.userPlant?._id)
                    ? "جاري الحذف..."
                    : "🗑️حذف النبتة "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDashboard;
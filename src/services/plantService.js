import axios from "axios";

const API_BASE = "https://graduation-project-co5p.onrender.com/api/v1/plants";

// 1. جلب النباتات
export const getPlants = async () => {
  const response = await axios.get(`${API_BASE}?page=1&limit=100`);
  return response.data.data;
};

// 2. جلب نبات واحد
export const getPlantById = async (plantId) => {
  const response = await axios.get(`${API_BASE}/${plantId}`);
  return response.data;
};

// 3. جلب أصناف النبات
export const getPlantVarieties = async (plantId) => {
  const response = await axios.get(`${API_BASE}/${plantId}/varieties`);
  return response.data;
};

// 4. جلب تربة نبتة معينة 
export const getPlantSoils = async (plantId) => {
  const response = await axios.get(`${API_BASE}/${plantId}/soils`);
  return response.data;
};
export const getPlantDiseases = async (plantId) => {
  try {
    // 1. جلب التوكين من المتصفح
    const token = localStorage.getItem("token");

    // 2. إرسال الطلب مع التوكين في الـ Headers
    const response = await axios.get(`${API_BASE}/${plantId}/diseases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🔥 استجابة الأمراض بعد إضافة التوكين:", response.data);

    
    const diseases =
      response.data?.data?.diseases ||
      response.data?.data ||
      response.data?.diseases ||
      response.data;

    return Array.isArray(diseases) ? diseases : [];
  } catch (error) {
    console.error("خطأ في جلب أمراض النبتة:", error);
    return [];
  }
};
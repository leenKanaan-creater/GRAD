import axios from "axios";

const API_BASE_URL = "https://graduation-project-co5p.onrender.com/api/v1";

// دالة مساعدة لجلب التوكن وإرفاقه في الـ Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. جلب كل نباتات المستخدم
export const getUserPlants = async () => {
  const response = await axios.get(`${API_BASE_URL}/userplants`, getAuthHeaders());
  return response.data;
};

// 2. جلب نبتة محددة للمستخدم بواسطة ID
export const getUserPlantById = async (userPlantId) => {
  const response = await axios.get(`${API_BASE_URL}/userplants/${userPlantId}`, getAuthHeaders());
  return response.data;
};

// 3. إضافة نبتة جديدة للمستخدم
export const addUserPlant = async (plantId, plantData = {}) => {
  const response = await axios.post(
    `${API_BASE_URL}/userplants`,
    {
      plant_id: plantId,
      location: plantData.location || "الشرفة",
      planting_date: plantData.planting_date || plantData.plantingDate || new Date().toISOString().split("T")[0],
      last_watering_date: plantData.last_watering_date || plantData.lastWateringDate || new Date().toISOString().split("T")[0],
    },
    getAuthHeaders()
  );
  return response.data;
};

// 4. تعديل نبتة للمستخدم
export const updateUserPlant = async (userPlantId, updateData) => {
  const response = await axios.put(`${API_BASE_URL}/userplants/${userPlantId}`, updateData, getAuthHeaders());
  return response.data;
};

// 5. حذف نبتة من قائمة المستخدم
export const deleteUserPlant = async (userPlantId) => {
  const response = await axios.delete(`${API_BASE_URL}/userplants/${userPlantId}`, getAuthHeaders());
  return response.data;
};

// 6. جلب دراسة التربة الموصى بها للنبتة
export const getPlantSoils = async (plantId) => {
  const response = await axios.get(`${API_BASE_URL}/plants/${plantId}/soils`, getAuthHeaders());
  return response.data;
};

// 7. جلب جدول الري
export const getWateringSchedule = async (userPlantId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/userplants/${userPlantId}/watering`, getAuthHeaders());
    return response.data;
  } catch (err) {
    console.warn("المسار المنفصل للري غير موجود أو أرجع خطأ:", err);
    return null;
  }
};

// 8. جلب جدول التسميد
export const getFertilizerSchedule = async (userPlantId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/userplants/${userPlantId}/fertilizer`, getAuthHeaders());
    return response.data;
  } catch (err) {
    console.warn("المسار المنفصل للتسميد غير موجود أو أرجع خطأ:", err);
    return null;
  }
};
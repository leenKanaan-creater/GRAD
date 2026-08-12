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
  const response = await axios.get(`${API_BASE}/${plantId}/diseases`);
  return response.data.data;
};
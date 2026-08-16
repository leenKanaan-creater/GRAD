const API_URL = "https://graduation-project-co5p.onrender.com/api/v1";

// دالة مساعدة لإعداد الهيدر للـ API Requests
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// 1. جلب البيانات بحسب النوع (plants, diseases, users)
export const fetchAdminData = async (resource) => {
  const res = await fetch(`${API_URL}/${resource}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("فشل جلب البيانات من السيرفر");
  return await res.json();
};

// 2. إنشاء عنصر جديد
export const createAdminItem = async (resource, data) => {
  const res = await fetch(`${API_URL}/${resource}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل عملية الإضافة");
  return await res.json();
};

// 3. تعديل عنصر موجود
export const updateAdminItem = async (resource, id, data) => {
  const res = await fetch(`${API_URL}/${resource}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل عملية التعديل");
  return await res.json();
};

// 4. حذف عنصر (نبات أو مرض أو مستخدم)
export const deleteAdminItem = async (resource, id) => {
  const res = await fetch(`${API_URL}/${resource}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("فشل عملية الحذف");
  return await res.json();
};

// 5. رفع صورة إلى السيرفر
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://graduation-project-co5p.onrender.com/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("فشل رفع الصورة");
  return await res.json();
};
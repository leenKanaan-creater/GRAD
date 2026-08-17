import React, { useState, useEffect } from "react";
import "./AdminPanel.css";
import { 
  Users, Leaf, Bug, LayoutDashboard, 
  Plus, Trash2, Edit, Search, X, Loader2, ImageOff
} from "lucide-react";
import { 
  fetchAdminData, 
  deleteAdminItem, 
  createAdminItem, 
  updateAdminItem, 
  uploadImage 
} from "../services/adminService";

const BASE_URL = "https://graduation-project-co5p.onrender.com";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("plants");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({ name: "", description: "", email: "", role: "" });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminData(`${activeTab}?limit=1000`);
      
      let items = [];

      // 🎯 فصل جلب البيانات حسب التبويب لمنع تداخل الأمراض مع المستخدمين
      if (activeTab === "users") {
        items = result?.users || result?.data || (Array.isArray(result) ? result : []);
      } else if (activeTab === "diseases") {
        items = result?.diseases || result?.data || (Array.isArray(result) ? result : []);
      } else {
        items = result?.plants || result?.data || (Array.isArray(result) ? result : []);
      }

      setData(items);
    } catch (err) {
      console.error("خطأ أثناء جلب البيانات:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ استخراج اسم العنصر / اسم المستخدم
  const getItemName = (item) => {
    if (!item) return "بدون اسم";
    if (activeTab === "users") {
      return item.username || item.name || item.email?.split("@")[0] || "مستخدم";
    }
    return (
      item.common_name || 
      item.diseaseName || 
      item.disease_name || 
      item.name || 
      item.plantName || 
      item.title || 
      item.scientific_name ||
      "بدون اسم"
    );
  };

  // 🛠️ استخراج رابط الصورة الدقيق للنباتات والأمراض
  const getImageUrl = (item) => {
    if (!item || activeTab === "users") return null;

    let raw = null;

    // 1. فحص مصفوفة الصور images
    if (Array.isArray(item.images) && item.images.length > 0) {
      const img = item.images[0];
      raw = typeof img === "string" ? img : (img?.url || img?.secure_url || img?.path);
    } 
    // 2. فحص الكائن المباشر برقم 0
    else if (item[0]) {
      const img = item[0];
      raw = typeof img === "string" ? img : (img?.url || img?.secure_url || img?.path);
    }

    // 3. فحص الحقول الفردية المباشرة
    if (!raw) {
      raw = item.disease_image || item.diseaseImage || item.image_url || item.imageUrl || item.image || item.url;
    }

    if (!raw || typeof raw !== "string") return null;

    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:image")) {
      return raw.replace("http://", "https://");
    }

    const cleanPath = raw.replace(/\\/g, "/");
    return `${BASE_URL}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من إجراء عملية الحذف؟")) return;
    try {
      await deleteAdminItem(activeTab, id);
      setData(data.filter((item) => (item._id || item.id) !== id));
      alert("تم الحذف بنجاح");
    } catch (err) {
      alert("تعذر الحذف: " + err.message);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        name: getItemName(item),
        description: item.description || item.symptoms || item.treatment || "",
        email: item.email || "",
        role: item.role || "user",
      });
    } else {
      setFormData({ name: "", description: "", email: "", role: "" });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let imageUrl = editingItem ? getImageUrl(editingItem) : "";

      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        imageUrl = uploadRes.url || uploadRes.imageUrl || imageUrl;
      }

      const payload = { ...formData };
      if (imageUrl) payload.image = imageUrl;

      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await updateAdminItem(activeTab, id, payload);
        alert("تم التعديل بنجاح");
      } else {
        await createAdminItem(activeTab, payload);
        alert("تمت الإضافة بنجاح");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert("حدث خطأ: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const title = getItemName(item) || item.email || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="admin-container">
      
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div>
          <div className="sidebar-title">
            <div className="title-icon">
              <LayoutDashboard size={24} />
            </div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#34d399", margin: 0 }}>لوحة الإدارة</h1>
          </div>

          <nav className="sidebar-nav">
            <button
              onClick={() => setActiveTab("plants")}
              className={`nav-button ${activeTab === "plants" ? "active" : ""}`}
            >
              <Leaf size={20} /> إدارة النباتات
            </button>

            <button
              onClick={() => setActiveTab("diseases")}
              className={`nav-button ${activeTab === "diseases" ? "active" : ""}`}
            >
              <Bug size={20} /> إدارة الأمراض
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`nav-button ${activeTab === "users" ? "active" : ""}`}
            >
              <Users size={20} /> إدارة المستخدمين
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        
        <div className="admin-header">
          <div className="header-title">
            <h2>
              {activeTab === "plants" && "إدارة موسوعة النباتات"}
              {activeTab === "diseases" && "سجل الأمراض والعلاجات"}
              {activeTab === "users" && "قائمة المستخدمين المسجلين"}
            </h2>
            <p>إجمالي العناصر: {filteredData.length}</p>
          </div>

          <button onClick={() => handleOpenModal()} className="btn-add">
            <Plus size={18} /> إضافة عنصر جديد
          </button>
        </div>

        {/* Search */}
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="بحث عن عنصر..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Table */}
        <div className="table-card">
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
              <Loader2 className="animate-spin" size={20} /> جاري تحميل البيانات...
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>العنوان / الاسم</th>
                  <th>{activeTab === "users" ? "البريد الإلكتروني" : "التصنيف / التفاصيل"}</th>
                  <th>المعرف (ID)</th>
                  <th style={{ textAlign: "center" }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                      لا توجد بيانات مطابقة لعرضها
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const itemId = item._id || item.id;
                    const itemName = getItemName(item);
                    const imgUrl = getImageUrl(item);

                    return (
                      <tr key={itemId}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {activeTab !== "users" && (
                              <div style={{ width: "45px", height: "45px", minWidth: "45px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {imgUrl ? (
                                  <img 
                                    src={imgUrl} 
                                    alt={itemName} 
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <ImageOff size={18} color="#64748b" />
                                )}
                              </div>
                            )}
                            <span>{itemName}</span>
                          </div>
                        </td>
                        <td>
                          {activeTab === "users" ? (
                            <span>{item.email || "بدون بريد"}</span>
                          ) : (
                            <span className="badge">
                              {item.category || item.category_name || item.type || "عام"}
                            </span>
                          )}
                        </td>
                        <td style={{ fontFamily: "monospace", color: "#94a3b8", fontSize: "0.75rem" }}>
                          {itemId}
                        </td>
                        <td>
                          <div className="action-btns">
                            <button onClick={() => handleOpenModal(item)} className="btn-icon edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(itemId)} className="btn-icon delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button onClick={() => setIsModalOpen(false)} className="modal-close">
              <X size={20} />
            </button>

            <h3 style={{ margin: 0, fontSize: "1.25rem" }}>
              {editingItem ? "تعديل عنصر" : "إضافة عنصر جديد"}
            </h3>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>الاسم / العنوان</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {activeTab === "users" ? (
                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>الوصف</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>الصورة</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                </>
              )}

              <div className="form-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                  إلغاء
                </button>
                <button type="submit" disabled={formLoading} className="btn-submit">
                  {formLoading ? "جاري الحفظ..." : "حفظ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
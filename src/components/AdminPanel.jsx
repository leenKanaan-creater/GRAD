import React, { useState, useEffect } from "react";
import "./AdminPanel.css"; // 👈 استيراد الـ CSS
import { 
  Users, Leaf, Bug, LayoutDashboard, LogOut, 
  Plus, Trash2, Edit, Search, X, Loader2 
} from "lucide-react";
import { 
  fetchAdminData, 
  deleteAdminItem, 
  createAdminItem, 
  updateAdminItem, 
  uploadImage 
} from "../services/adminService";

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
      const result = await fetchAdminData(activeTab);
      const items = Array.isArray(result) ? result : (result.data || []);
      setData(items);
    } catch (err) {
      console.error("خطأ أثناء جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت تأكد من إجراء عملية الحذف؟")) return;
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
        name: item.name || item.username || "",
        description: item.description || "",
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
      let imageUrl = editingItem?.image || editingItem?.imageUrl || "";

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
    const title = item.name || item.username || item.email || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="admin-container">
      
      {/* 🟢 Sidebar */}
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

        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          className="nav-button logout-btn"
        >
          <LogOut size={20} /> تسجيل الخروج
        </button>
      </aside>

      {/* ⚪ Main Content */}
      <main className="admin-main">
        
        <div className="admin-header">
          <div className="header-title">
            <h2>
              {activeTab === "plants" && "إدارة موسوعة النباتات"}
              {activeTab === "diseases" && "سجل الأمراض والعلاجات"}
              {activeTab === "users" && "قائمة المستخدمين المسجلين"}
            </h2>
            <p>إضافة، تعديل، وحذف البيانات بكل سهولة.</p>
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
                    return (
                      <tr key={itemId}>
                        <td>
                          <div className="cell-flex">
                            {activeTab !== "users" && (
                              <div className="table-img">
                                <img 
                                  src={item.image || item.imageUrl || "https://via.placeholder.com/100"} 
                                  alt="" 
                                />
                              </div>
                            )}
                            <span>{item.name || item.username || "بدون اسم"}</span>
                          </div>
                        </td>
                        <td>
                          {activeTab === "users" ? (
                            <span>{item.email}</span>
                          ) : (
                            <span className="badge">
                              {item.category || item.type || "عام"}
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

      {/* 🔴 Modal */}
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
// import { useEffect, useState } from "react";
// import { getPlants, getPlantSoils } from "../services/plantService"; // استيراد الدوال من ملف الخدمة الخاص بكِ
// import "./Soils.css"; 

// const Soils = () => {
//   const [soilsList, setSoilsList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAllSoils = async () => {
//       try {
//         setLoading(true);
//         // 1. جلب قائمة النباتات كاملة من السيرفر الخاص بكِ
//         const plants = await getPlants();
        
//         if (!plants || plants.length === 0) {
//           throw new Error("لم يتم العثور على أي نباتات في قاعدة البيانات.");
//         }

//         // 2. جلب التربة الخاصة بكل نبتة بشكل متوازي وسريع
//         const soilPromises = plants.map(async (plant) => {
//           try {
//             const soilData = await getPlantSoils(plant._id);
//             // الباك إند قد يرجع مصفوفة تربة أو كائن مفرد، نأخذ العنصر الأول
//             return soilData.data?.[0] || soilData.data || null;
//           } catch (err) {
//             console.warn(`فشل جلب التربة للنبتة ذات المعرّف ${plant._id}:`, err);
//             return null;
//           }
//         });

//         const soilsResults = await Promise.all(soilPromises);

//         // 3. تنظيف البيانات من القيم الفارغة والمكررة لكي تظهر صفحة فخمة ومميزة
//         const validSoils = soilsResults.filter((soil) => soil !== null);
        
//         const uniqueSoils = [];
//         const seenIds = new Set();
//         for (const soil of validSoils) {
//           if (soil._id && !seenIds.has(soil._id)) {
//             seenIds.add(soil._id);
//             uniqueSoils.push(soil);
//           }
//         }

//         setSoilsList(uniqueSoils);
//         setLoading(false);
//       } catch (err) {
//         console.error("خطأ أثناء جلب موسوعة التربة:", err);
//         setError(err.message || "حدث خطأ أثناء الاتصال بالسيرفر.");
//         setLoading(false);
//       }
//     };

//     fetchAllSoils();
//   }, []);

//   if (loading) {
//     return (
//       <div className="soils-loading">
//         <div className="spinner"></div>
//         <p></p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="soils-error-container" style={{ textAlign: "center", padding: "40px", fontFamily: "Cairo" }}>
//         <div style={{ fontSize: "50px" }}>⚠️</div>
//         <h3 style={{ color: "#991b1b" }}>عذراً، تعذر جلب البيانات</h3>
//         <p style={{ color: "#4b5563" }}>{error}</p>
//         <button 
//           onClick={() => window.location.reload()} 
//           style={{ marginTop: "15px", padding: "8px 20px", background: "#0d330e", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
//         >
//           إعادة المحاولة
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="soils-page-container">
//       {/* مقدمة الصفحة */}
//       <div className="soils-hero-section">
//         <span className="hero-badge">موسوعة رعاية الجذور</span>
//         <h1>دليل التربة المثالية 🪵</h1>
//         <p>استعراض شامل وديناميكي لكافة أنواع التربة المسجلة في مشروع التخرج الخاص بكِ.</p>
//       </div>

//       {/* شبكة استعراض أنواع التربة الحقيقية */}
//       <div className="soils-grid">
//         {soilsList.length === 0 ? (
//           <p style={{ textAlign: "center", gridColumn: "1/-1", color: "#64748b" }}>لا توجد بيانات تربة مضافة في قاعدة البيانات حالياً.</p>
//         ) : (
//           soilsList.map((soil) => (
//             <div className="soil-premium-card" key={soil._id}>
              
//               <div className="soil-card-header">
//                 <div className="soil-avatar">🤎</div>
//                 <div className="soil-title-area">
//                   <h2>{soil.name}</h2>
//                   <span className="soil-tag">{soil.types}</span>
//                 </div>
//               </div>
              
//               <p className="soil-description">{soil.description}</p>

//               <hr className="divider" />

//               {/* تفاصيل الحموضة pH */}
//               {soil.phlevel && (
//                 <div className="ph-indicator-box">
//                   <div className="ph-title">
//                     <span>🧪 درجة الحموضة (pH Level)</span>
//                     <strong className="ph-range">
//                       {soil.phlevel.min} - {soil.phlevel.max}
//                     </strong>
//                   </div>
//                   <div className="ph-bar-container">
//                     <div className="ph-bar-progress" style={{ width: `${(soil.phlevel.max / 14) * 100}%` }}></div>
//                   </div>
//                 </div>
//               )}

//               <hr className="divider" />

//               {/* الخصائص الفريدة */}
//               {soil.properties && (
//                 <div className="soil-specs-grid">
                  
//                   <div className="spec-tile">
//                     <span className="spec-icon">💧</span>
//                     <div className="spec-info">
//                       <span className="spec-label">مستوى الرطوبة</span>
//                       <span className="spec-value">
//                         {soil.properties.moisture_level === "moderate" ? "متوسطة" : soil.properties.moisture_level}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="spec-tile">
//                     <span className="spec-icon">⏳</span>
//                     <div className="spec-info">
//                       <span className="spec-label">تصريف المياه</span>
//                       <span className="spec-value">
//                         {soil.properties.drainage === "moderate" ? "متوسط" : soil.properties.drainage}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="spec-tile">
//                     <span className="spec-icon">🍂</span>
//                     <div className="spec-info">
//                       <span className="spec-label">المادة العضوية</span>
//                       <span className="spec-value">
//                         {soil.properties.organiceMatter === "moderate" ? "معتدلة" : soil.properties.organiceMatter}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="spec-tile">
//                     <span className="spec-icon">🔍</span>
//                     <div className="spec-info">
//                       <span className="spec-label">بنية التربة</span>
//                       <span className="spec-value">
//                         {soil.properties.texture === "medium" ? "متوسطة النعومة" : soil.properties.texture}
//                       </span>
//                     </div>
//                   </div>

//                 </div>
//               )}

//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Soils;
import React from 'react';
import './Dashboard.css';
import { dashboardData } from '../mockData';

const Dashboard = () => {
  const { stats, myPlants } = dashboardData;

  return (
    <div className="dashboard-page">
      {/* 1. قسم كروت الإحصائيات السريعة */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <h3>إجمالي النباتات 🪴</h3>
          <p className="stat-number">{stats.totalPlants}</p>
        </div>
        <div className="stat-card">
          <h3>نباتات سليمة 🟢</h3>
          <p className="stat-number">{stats.healthyPlants}</p>
        </div>
        <div className="stat-card danger">
          <h3>حالات إصابة 🩺</h3>
          <p className="stat-number">{stats.sickPlants}</p>
        </div>
        <div className="stat-card warning">
          <h3>مواعيد الري اليوم 💧</h3>
          <p className="stat-number">{stats.todayWatering}</p>
        </div>
      </section>

      {/* 2. قسم متابعة نباتاتي */}
      <section className="dashboard-section">
        <div className="section-title">
          <h2>متابعة حديقتي</h2>
        </div>

        <div className="plants-grid">
          {myPlants.map((plant) => (
            <div className="plant-dashboard-card" key={plant.id}>
              <div className="card-image-box">
                <img src={plant.image} alt={plant.name} />
                <span className="badge-tag">{plant.category}</span>
              </div>
              <div className="card-content">
                <h3>{plant.name}</h3>
                <p className="latin-name">الاسم العلمي: {plant.scientificName}</p>
                <div className="plant-info-status">
                  <span>الحالة الصحية: <strong>{plant.status}</strong></span>
                  <span>موعد الري: <strong>{plant.nextWatering}</strong></span>
                </div>
                <button className="action-btn">استكشف التفاصيل ←</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
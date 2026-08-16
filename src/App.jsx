import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Plants from "./components/Plants";
import PlantDetails from "./components/PlantDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import PlantDashboard from "./components/PlantDashboard";
import Diseases from "./components/Diseases";
import AdminPanel from "./components/AdminPanel"; // 👈 1. استيراد لوحة التحكم
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* 🌐 صفحات عامة */}
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/plants/:id" element={<PlantDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 صفحة نباتاتي (محمية) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PlantDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔒 صفحة الأمراض (محمية) */}
        <Route
          path="/diseases"
          element={
            <ProtectedRoute>
              <Diseases />
            </ProtectedRoute>
          }
        />

        {/* ⚙️ لوحة تحكم المسؤول (محمية) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
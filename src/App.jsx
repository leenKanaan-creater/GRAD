import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Plants from "./components/Plants";
import PlantDetails from "./components/PlantDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import PlantDashboard from "./components/PlantDashboard";
import Dashboard from "./components/Dashboard";
import Diseases from "./components/Diseases";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/plants/:id" element={<PlantDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PlantDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/diseases" element={<Diseases />} />

        <Route path="/dashboards" element={<Dashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

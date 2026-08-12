// src/mockData.js
export const dashboardData = {
  stats: {
    totalPlants: 8,
    healthyPlants: 6,
    sickPlants: 2,
    todayWatering: 3
  },
  myPlants: [
    {
      id: "1",
      name: "جزر",
      scientificName: "Daucus carota L.",
      category: "vegetables",
      status: "سليم",
      nextWatering: "اليوم",
      image: "https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "2",
      name: "بصل",
      scientificName: "Allium cepa L.",
      category: "vegetables",
      status: "مصاب بمرض",
      nextWatering: "غداً",
      image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=80"
    }
  ]
};
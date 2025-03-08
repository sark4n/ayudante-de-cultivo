"use client";

export default function Header({ activeSection }) {
  const iconMap = {
    home: "home",
    plants: "leaf",
    guides: "book",
    community: "users",
    achievements: "trophy",
    premium: "star",
    profile: "user",
    stats: "chart-bar",
  };

  const titleMap = {
    home: "Inicio",
    plants: "Mis Plantas",
    guides: "Guías",
    community: "Comunidad",
    achievements: "Logros",
    premium: "Premium",
    profile: "Perfil",
    stats: "Estadísticas",
  };

  return (
    <header>
      <h1>
        <i className={`fas fa-${iconMap[activeSection]}`}></i>
        {titleMap[activeSection]}
      </h1>
    </header>
  );
}
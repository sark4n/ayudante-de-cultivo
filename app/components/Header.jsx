"use client";

export default function Header({ activeSection }) {
  const iconMap = {
    home: "home",
    plants: "leaf",
    missions: "trophy",
    community: "users",
    profile: "user",
    stats: "chart-bar",
    guides: "book",
  };

  const titleMap = {
    home: "Inicio",
    plants: "Mis Plantas",
    missions: "Misiones",
    community: "Comunidad",
    profile: "Perfil",
    stats: "Estadísticas",
    guides: "Guías",
  };

  return (
    <header className="header"> {/* Añadí clase 'header' para consistencia con CSS */}
      <h1>
        <i className={`fas fa-${iconMap[activeSection]}`}></i>
        {titleMap[activeSection]}
      </h1>
    </header>
  );
}
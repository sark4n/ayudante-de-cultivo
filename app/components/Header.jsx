"use client";

import { toggleDarkMode } from '../lib/navigation';

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
    <header className="header">
      <h1>
        <i className={`fas fa-${iconMap[activeSection]}`}></i>
        {titleMap[activeSection]}
      </h1>
      <button className="dark-mode-btn" onClick={toggleDarkMode}>
        <i className={document.body.classList.contains('dark') ? 'fas fa-moon' : 'fas fa-sun'}></i>
      </button>
    </header>
  );
}
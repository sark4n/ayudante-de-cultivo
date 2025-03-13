"use client";

import { useState, useEffect } from "react";
import Plants from "../plants/page";
import Missions from "../missions/page";
import Stats from "./Stats";
import Profile from "../profile/page";

export default function MainContent({
  activeSection,
  plants,
  setPlants,
  userData,
  setUserData,
  setActiveSection,
  queueNotification,
  setSelectedAchievement,
  selectedAchievement,
  selectedPlant,
  setSelectedPlant,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "¡Desbloquea Estadisticas Avanzadas!",
      text: "Accede a prediccion de cosecha y más.",
      image: "/images/premium-tool.jpg",
      cta: "Conoce Mas",
      action: "plants",
    },
    {
      title: "Consejo del día",
      text: "Riega al amanecer para mejor absorción.",
      image: "/images/watering-plant.jpg",
      cta: "Aprende más",
      action: "guides",
    },
    {
      title: "¡Sube de nivel!",
      text: "Completa misiones y gana logros.",
      image: "/images/trophy.jpg",
      cta: "Ver misiones",
      action: "missions",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const pendingMissionsCount = () => {
    const dailyMissions = [
      { id: "checkPlant", target: 1 },
      { id: "waterPlant", target: 1 },
      { id: "updatePlant", target: 1 },
    ];
    let count = 0;
    dailyMissions.forEach(mission => {
      const progress = userData.missionProgress[mission.id] || 0;
      const completed = userData.missionProgress[`${mission.id}_completed`] || false;
      if (progress >= mission.target && !completed) count++;
    });
    return count + (userData.pendingMissionCompletions || 0);
  };

  const levels = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];
  const currentLevel = userData.level || 0;
  const currentXp = userData.xp || 0;
  const nextLevelXp = levels[currentLevel + 1] || levels[currentLevel];
  const xpProgress = (currentXp / nextLevelXp) * 100;

  const featuredPlant = plants.length > 0
    ? plants.reduce((prev, current) => {
        const prevUpdates = prev.updates ? prev.updates.length : 0;
        const currUpdates = current.updates ? current.updates.length : 0;
        const prevLatest = prev.updates && prev.updates.length > 0
          ? Math.max(...prev.updates.map(u => new Date(u.date).getTime()))
          : new Date(prev.startDate).getTime();
        const currLatest = current.updates && current.updates.length > 0
          ? Math.max(...current.updates.map(u => new Date(u.date).getTime()))
          : new Date(current.startDate).getTime();
        return (currUpdates > prevUpdates || (currUpdates === prevUpdates && currLatest > prevLatest))
          ? current
          : prev;
      }, plants[0])
    : null;

  const dailyMissions = [
    { id: "checkPlant", name: "Chequear Planta", xp: 10, target: 1, icon: "fas fa-eye" },
    { id: "waterPlant", name: "Regar Planta", xp: 15, target: 1, icon: "fas fa-tint" },
    { id: "updatePlant", name: "Actualizar Planta", xp: 20, target: 1, icon: "fas fa-sync-alt" },
  ];

  return (
    <main>
      <section id="home" className={activeSection === "home" ? "active" : "hidden"}>
        <div className="carousel">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-content">
                <h3>{slide.title}</h3>
                <p>{slide.text}</p>
                <button
                  className="cta-btn"
                  onClick={() => setActiveSection(slide.action)}
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          ))}
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>

        <div className="user-summary">
          <h3>Tu Progreso</h3>
          <div className="summary-details">
            <p><i className="fas fa-user"></i> Nivel: {currentLevel}</p>
            <p><i className="fas fa-leaf"></i> Plantas: {plants.length}</p>
            <p><i className="fas fa-trophy"></i> Misiones pendientes: {pendingMissionsCount()}</p>
          </div>
          <div className="xp-bar">
            <div
              className="xp-progress"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            ></div>
            <span className="xp-text">{currentXp}/{nextLevelXp} XP</span>
          </div>
        </div>

        <div className="action-cards">
          <div className="action-card plants-card" onClick={() => setActiveSection("plants")}>
            <i className="fas fa-leaf"></i>
            <h4>Revisa tus plantas</h4>
            <p>Cuida tu cultivo</p>
          </div>
          <div className="action-card missions-card" onClick={() => setActiveSection("missions")}>
            <i className="fas fa-trophy"></i>
            <h4>Completa una misión</h4>
            <p>Gana XP ahora</p>
          </div>
          <div className="action-card premium-card" onClick={() => setActiveSection("premium")}>
            <i className="fa-solid fa-crown"></i>
            <h4>Explora Premium</h4>
            <p>Desbloquea más</p>
          </div>
        </div>

        {featuredPlant ? (
          <div className="featured-plant">
            <h3><i className="fas fa-star"></i> Planta Destacada</h3>
            <div
              className="plant-card"
              style={{ backgroundImage: `url(${featuredPlant.photo || '/images/plant-placeholder.jpg'})` }}
              onClick={() => setActiveSection("plants")}
            >
              <div className="plant-overlay">
                <h4>{featuredPlant.name || "Sin nombre"}</h4>
                <p>{featuredPlant.updates?.length || 0} actualizaciones</p>
                <button className="plant-btn">Ver detalles</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="featured-plant">
            <h3><i className="fas fa-star"></i> Planta Destacada</h3>
            <div
              className="plant-card no-plants-card"
              style={{ backgroundImage: `url('/images/plant-placeholder.jpg')` }}
            >
              <div className="plant-overlay">
                <button
                  className="no-plants-cta"
                  onClick={() => setActiveSection("plants")}
                >
                  No tienes plantas aún. ¡Añade una! <i className="fa-solid fa-seedling"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="daily-missions">
          <h3><i className="fas fa-trophy"></i> Misiones Diarias</h3>
          <div className="missions-list">
            {dailyMissions.map(mission => {
              const progress = userData.missionProgress[mission.id] || 0;
              const completed = userData.missionProgress[`${mission.id}_completed`] || false;
              const requirementMet = progress >= mission.target;

              return (
                <div
                  key={mission.id}
                  className={`mission-card ${completed ? 'completed' : ''}`}
                  onClick={() => !requirementMet && !completed && setActiveSection("plants")}
                >
                  <i className={mission.icon}></i>
                  <div className="mission-info">
                    <span>{mission.name} (+{mission.xp} XP)</span>
                    <div className="mission-progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${Math.min((progress / mission.target) * 100, 100)}%` }}
                      ></div>
                      <span>{progress}/{mission.target}</span>
                    </div>
                    {requirementMet && !completed && (
                      <button
                        className="finish-mission-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSection("missions");
                        }}
                      >
                        Terminar Misión
                      </button>
                    )}
                    {completed && <i className="fas fa-check mission-complete-icon"></i>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notificación de Oferta del Día */}
        <div className="daily-offer-notification">
          <i className="fas fa-gift offer-icon"></i>
          <div className="offer-content">
            <h4>¡Oferta del Día!</h4>
            <p>Primer mes de Premium al 50%.</p>
          </div>
          <button
            className="offer-cta"
            onClick={() => setActiveSection("premium")}
          >
            Reclamar Ahora
          </button>
        </div>

        {/* Widget de Comunidad */}
        <div className="community-widget">
          <h3><i className="fas fa-users"></i> Comunidad Activa</h3>
          <div
            className="community-preview"
            style={{ backgroundImage: `url('/images/community-placeholder.jpg')` }}
            onClick={() => setActiveSection("community")}
          >
            <div className="community-info">
              <h4>Último post: Cómo evitar plagas</h4>
              <p>Creado por Sark4n</p>
            </div>
          </div>
        </div>

        <p className="footer-text">Tu compañero para gestionar tus cultivos de manera fácil y discreta.</p>
      </section>

      {/* Resto de las secciones sin cambios */}
      <section id="plants" className={activeSection === "plants" ? "active" : "hidden"}>
        <Plants
          plants={plants}
          setPlants={setPlants}
          userData={userData}
          setUserData={setUserData}
          setActiveSection={setActiveSection}
          queueNotification={queueNotification}
          selectedPlant={selectedPlant}
          setSelectedPlant={setSelectedPlant}
        />
      </section>

      <section id="guides" className={activeSection === "guides" ? "active" : "hidden"}>
        <p>- Regar cada 3 días en etapa vegetativa.</p>
        <p>- Mantener temperatura entre 20-25°C.</p>
        <div id="tipOfTheDay">
          <h3>
            <i className="fas fa-lightbulb"></i> Tip del día
          </h3>
          <p id="tipText"></p>
        </div>
      </section>

      <section id="community" className={activeSection === "community" ? "active" : "hidden"}>
        <p>Sección de Comunidad - Próximamente</p>
      </section>

      <section id="missions" className={activeSection === "missions" ? "active" : "hidden"}>
        <Missions
          userData={userData}
          setUserData={setUserData}
          plants={plants}
          queueNotification={queueNotification}
        />
      </section>

      <section id="premium" className={activeSection === "premium" ? "active" : "hidden"}>
        <p>
          <button disabled className="plant-btn">
            <i className="fas fa-clock"></i> Predecir cosecha - Próximamente
          </button>
        </p>
      </section>

      <section id="stats" className={activeSection === "stats" ? "active" : "hidden"}>
        <Stats plants={plants} userData={userData} setActiveSection={setActiveSection} />
      </section>

      <section id="profile" className={activeSection === "profile" ? "active" : "hidden"}>
        <Profile
          userData={userData}
          setUserData={setUserData}
          plants={plants}
          setPlants={setPlants}
          setActiveSection={setActiveSection}
        />
      </section>
    </main>
  );
}
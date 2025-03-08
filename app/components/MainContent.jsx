"use client";

import Plants from "../plants/page";
import Achievements from "../achievements/page";
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
}) {
  return (
    <main>
      <section id="home" className={activeSection === "home" ? "active" : "hidden"}>
        <p>Tu compañero para gestionar tus cultivos de manera fácil y discreta.</p>
      </section>

      <section id="plants" className={activeSection === "plants" ? "active" : "hidden"}>
        <Plants
          plants={plants}
          setPlants={setPlants}
          userData={userData}
          setUserData={setUserData}
          setActiveSection={setActiveSection}
          queueNotification={queueNotification}
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

      <section id="achievements" className={activeSection === "achievements" ? "active" : "hidden"}>
        <Achievements
          userData={userData}
          setUserData={setUserData}
          plants={plants}
          queueNotification={queueNotification}
          setSelectedAchievement={setSelectedAchievement}
          selectedAchievement={selectedAchievement}
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
          setSelectedAchievement={setSelectedAchievement}
        />
      </section>
    </main>
  );
}
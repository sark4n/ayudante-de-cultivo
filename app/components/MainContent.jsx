"use client";

import Plants from '../plants/page';
import Achievements from '../achievements/page';
import Stats from './Stats';
import Profile from '../profile/page'; 

export default function MainContent({ activeSection, plants, setPlants, userData, setUserData, setActiveSection, queueNotification }) {
  return (
    <main>
      <section id="home" className={activeSection === 'home' ? 'active' : 'hidden'}>
        <p className="text-green-700 dark:text-green-300">Tu compañero para gestionar tus cultivos de manera fácil y discreta.</p>
      </section>

      <section id="plants" className={activeSection === 'plants' ? 'active' : 'hidden'}>
        <Plants plants={plants} setPlants={setPlants} userData={userData} setUserData={setUserData} setActiveSection={setActiveSection} queueNotification={queueNotification} />
      </section>

      <section id="guides" className={activeSection === 'guides' ? 'active' : 'hidden'}>
        <p className="text-green-700 dark:text-green-300">- Regar cada 3 días en etapa vegetativa.</p>
        <p className="text-green-700 dark:text-green-300">- Mantener temperatura entre 20-25°C.</p>
        <div id="tipOfTheDay" className="mt-5">
          <h3 className="text-green-700 flex items-center gap-2 dark:text-green-300"><i className="fas fa-lightbulb"></i> Tip del día</h3>
          <p id="tipText" className="text-green-700 dark:text-green-300"></p>
        </div>
      </section>

      <section id="community" className={activeSection === 'community' ? 'active' : 'hidden'}>
        <p className="text-green-700 dark:text-green-300">Sección de Comunidad - Próximamente</p>
      </section>

      <section id="achievements" className={activeSection === 'achievements' ? 'active' : 'hidden'}>
        <Achievements userData={userData} setUserData={setUserData} plants={plants} queueNotification={queueNotification} />
      </section>

      <section id="premium" className={activeSection === 'premium' ? 'active' : 'hidden'}>
        <p>
          <button disabled className="bg-gray-400 text-white p-10 rounded-md cursor-not-allowed flex items-center gap-5 dark:bg-gray-600 dark:text-gray-300">
            <i className="fas fa-clock"></i> Predecir cosecha - Próximamente
          </button>
        </p>
      </section>

      <section id="stats" className={activeSection === 'stats' ? 'active' : 'hidden'}>
        <Stats plants={plants} userData={userData} setActiveSection={setActiveSection} />
      </section>

      <section id="profile" className={activeSection === 'profile' ? 'active' : 'hidden'}>
        <Profile userData={userData} setUserData={setUserData} plants={plants} setPlants={setPlants} />
      </section>
    </main>
  );
}
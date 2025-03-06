"use client";

export default function Header({ activeSection }) {
  return (
    <header>
      <h1 className="flex items-center gap-2 text-white">
        <i className={`fas fa-${activeSection === 'home' ? 'home' : activeSection === 'plants' ? 'leaf' : activeSection === 'guides' ? 'book' : activeSection === 'community' ? 'users' : activeSection === 'achievements' ? 'trophy' : activeSection === 'premium' ? 'star' : activeSection === 'profile' ? 'user' : 'chart-bar'}`} style={{ fontSize: '20px' }}></i>
        {activeSection === 'home' ? 'Inicio' : activeSection === 'plants' ? 'Mis Plantas' : activeSection === 'guides' ? 'Guías' : activeSection === 'community' ? 'Comunidad' : activeSection === 'achievements' ? 'Logros' : activeSection === 'premium' ? 'Premium' : activeSection === 'profile' ? 'Perfil' : 'Estadísticas'}
      </h1>
    </header>
  );
}
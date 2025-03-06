"use client";

export default function Footer({ activeSection, handleSectionChange, userData }) {
  return (
    <footer id="footer" className="bg-white p-5 fixed bottom-0 w-full dark:bg-green-900 border-t border-green-200 dark:border-green-700">
      <nav className="flex justify-around">
        <button
          className={`tab-btn ${activeSection === 'home' ? 'active' : ''} w-60 flex flex-col items-center gap-3 p-8 text-green-700 hover:text-green-600 dark:text-green-300 dark:hover:text-green-200`}
          onClick={() => handleSectionChange('home')}
        >
          <i className="fas fa-home" style={{ fontSize: '18px' }}></i><span className="text-12">Inicio</span>
        </button>
        <button
          className={`tab-btn ${activeSection === 'plants' ? 'active' : ''} w-60 flex flex-col items-center gap-3 p-8 text-green-700 hover:text-green-600 dark:text-green-300 dark:hover:text-green-200`}
          onClick={() => handleSectionChange('plants')}
        >
          <i className="fas fa-leaf" style={{ fontSize: '18px' }}></i><span className="text-12">Plantas</span>
        </button>
        <button
          className={`tab-btn ${activeSection === 'guides' ? 'active' : ''} w-60 flex flex-col items-center gap-3 p-8 text-green-700 hover:text-green-600 dark:text-green-300 dark:hover:text-green-200`}
          onClick={() => handleSectionChange('guides')}
        >
          <i className="fas fa-book" style={{ fontSize: '18px' }}></i><span className="text-12">Guías</span>
        </button>
        <button
          className={`tab-btn ${activeSection === 'community' ? 'active' : ''} w-60 flex flex-col items-center gap-3 p-8 text-green-700 hover:text-green-600 dark:text-green-300 dark:hover:text-green-200`}
          onClick={() => handleSectionChange('community')}
        >
          <i className="fas fa-users" style={{ fontSize: '18px' }}></i><span className="text-12">Comunidad</span>
        </button>
        <button
          className={`tab-btn ${activeSection === 'profile' ? 'active' : ''} w-60 flex flex-col items-center gap-3 p-8 text-green-700 hover:text-green-600 dark:text-green-300 dark:hover:text-green-200`}
          onClick={() => handleSectionChange('profile')}
        >
          {userData.profilePhoto ? (
            <img src={userData.profilePhoto} alt="Perfil" className="profile-img" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
          ) : (
            <i className="fas fa-user" style={{ fontSize: '18px' }}></i>
          )}
          <span className="text-12">Perfil</span>
        </button>
      </nav>
    </footer>
  );
}
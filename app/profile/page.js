"use client";

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { toggleDarkMode } from '../lib/navigation';

export default function Profile({ userData, setUserData, plants, setPlants }) {
  const { data: session, status } = useSession();
  const [achievements] = useState([
    { 
      id: "novato", 
      name: "Cultivador Novato", 
      color: "#CD7F32", 
      icon: "fas fa-seedling",
      missions: [
        { id: "addFirstPlant", name: "Agrega tu primera planta", completed: false, count: plants.length, target: 1, icon: "fas fa-plus-circle" },
      ]
    },
    { 
      id: "avanzado", 
      name: "Cultivador Avanzado", 
      color: "#C0C0C0", 
      icon: "fas fa-leaf",
      missions: [
        { id: "addFivePlants", name: "Agrega 5 plantas", completed: false, count: plants.length, target: 5, icon: "fas fa-plus-circle" },
      ]
    },
    { 
      id: "experto", 
      name: "Cultivador Experto", 
      color: "#FFD700", 
      icon: "fas fa-trophy",
      missions: [
        { id: "addTenPlants", name: "Agrega 10 plantas", completed: false, count: plants.length, target: 10, icon: "fas fa-plus-circle" },
      ]
    },
  ]);

  useEffect(() => {
    if (status === 'authenticated') {
      setUserData(prev => ({
        ...prev,
        name: session?.user?.name || 'Usuario autenticado',
        email: session?.user?.email,
      }));
    }
  }, [session, status, setUserData]);

  const changeProfilePhoto = () => {
    if (status === 'authenticated') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const img = new Image();
          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              if (width > height) {
                if (width > 100) {
                  height *= 100 / width;
                  width = 100;
                }
              } else {
                if (height > 100) {
                  width *= 100 / height;
                  height = 100;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              const resizedData = canvas.toDataURL('image/jpeg', 0.7);
              setUserData(prev => ({ ...prev, profilePhoto: resizedData }));
            };
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      alert("No puedes cambiar la foto de perfil sin estar autenticado.");
    }
  };

  const logout = () => {
    signOut({ redirect: true, callbackUrl: '/' }).then(() => {
      setUserData({ achievements: [], missionProgress: {}, profilePhoto: null, name: '', email: '' });
      setPlants([]);
    });
  };

  const hasPendingMissions = achievements.some(ach => 
    !userData.achievements.includes(ach.id) && ach.missions.some(m => m.count >= m.target && !m.completed)
  );

  if (status === 'loading') {
    return <div className="text-center p-20 text-green-700 dark:text-green-300">Cargando...</div>;
  }

  return (
    <section id="profile" className={status === 'authenticated' ? '' : 'hidden'} style={{ textAlign: 'center', padding: '20px', position: 'relative' }}>
      <button
        className="dark-mode-btn absolute top-10 right-55 bg-green-500 text-white w-35 h-35 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors dark:bg-green-600 dark:hover:bg-green-700"
        onClick={toggleDarkMode}
      >
        <i className={document.body.classList.contains('dark') ? 'fas fa-moon' : 'fas fa-sun'}></i>
      </button>
      <button
        className="logout-btn absolute top-10 right-10 bg-red-500 text-white w-35 h-35 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
        onClick={logout}
      >
        <i className="fas fa-sign-out-alt"></i>
      </button>
      <div
        id="profilePhoto"
        className="w-100 h-100 rounded-full border-2 border-white bg-green-100 flex items-center justify-center overflow-hidden cursor-pointer mx-auto mb-15 relative dark:border-green-900 dark:bg-green-800"
        onClick={changeProfilePhoto}
      >
        {userData.profilePhoto ? (
          <img src={userData.profilePhoto} alt="Foto de Perfil" className="w-full h-full object-cover" />
        ) : (
          <i className="fas fa-user" style={{ fontSize: '40px', color: '#4caf50' }}></i>
        )}
      </div>
      <h2 className="text-green-700 dark:text-green-300">{userData.name || 'Usuario no autenticado'}</h2>
      <h3 className="flex items-center justify-center gap-5 text-green-700 mt-20 mb-15 dark:text-green-300">
        <i className="fas fa-trophy"></i> Mis Trofeos
      </h3>
      <div id="profileAchievements" className="flex justify-center gap-20">
        {achievements.map((ach) => {
          const isUnlocked = userData.achievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`achievement-circle ${isUnlocked ? 'unlocked' : ''}`}
              data-id={ach.id}
              style={{ cursor: 'pointer' }}
              onClick={() => window.showSection('achievements')}
            >
              <i className={ach.icon} style={{ fontSize: '24px', color: isUnlocked ? '#FFFFFF' : '#4caf50' }}></i>
            </div>
          );
        })}
      </div>
      {hasPendingMissions && (
        <div className="notification-dot" style={{ position: 'absolute', top: '5px', right: '110px' }}></div>
      )}
    </section>
  );
}
"use client";

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { toggleDarkMode } from '../lib/navigation';

export default function Profile({ userData, setUserData, plants, setPlants, setActiveSection, setSelectedAchievement }) {
  const { data: session, status } = useSession();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements');
        const data = await response.json();
        const updatedAchievements = data.map(ach => ({
          ...ach,
          missions: ach.missions.map(m => ({
            ...m,
            count: plants.length,
            completed: userData.missionProgress[`${m.id}_completed`] || false
          }))
        }));
        setAchievements(updatedAchievements);
      } catch (error) {
        console.error("Error al cargar logros:", error);
      }
    };
    fetchAchievements();
  }, [plants, userData.missionProgress]);

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
              const maxSize = 1000;
              if (width > height) {
                if (width > maxSize) {
                  height *= maxSize / width;
                  width = maxSize;
                }
              } else {
                if (height > maxSize) {
                  width *= maxSize / height;
                  height = maxSize;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              const resizedData = canvas.toDataURL('image/jpeg', 1);
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

  const handleAchievementClick = (ach) => {
    setSelectedAchievement(ach);
    setActiveSection('achievements');
  };

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
              className={`achievement ${isUnlocked ? 'unlocked' : ''}`}
              data-id={ach.id}
              onClick={() => handleAchievementClick(ach)}
            >
              <i className={ach.icon} style={{ fontSize: '32px', color: isUnlocked ? '#FFFFFF' : '#4caf50' }}></i>
              <div className="achievement-header">
                <p>{ach.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
"use client";

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function Profile({ userData, setUserData, plants, setPlants, setActiveSection }) {
  const { data: session, status } = useSession();
  const [achievements, setAchievements] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bio, setBio] = useState(userData.bio || '');
  const [theme, setTheme] = useState(userData.theme || 'default');
  const [isOnline, setIsOnline] = useState(userData.isOnline || false);
  const [allowMessages, setAllowMessages] = useState(userData.allowMessages !== false);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements');
        const data = await response.json();
        setAchievements(data);
      } catch (error) {
        console.error("Error al cargar logros:", error);
      }
    };
    fetchAchievements();
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      setUserData(prev => ({
        ...prev,
        name: session?.user?.name || 'Usuario autenticado',
        email: session?.user?.email,
        level: session?.user?.level || 0,
        xp: session?.user?.xp || 0,
        profilePhoto: session?.user?.profilePhoto || prev.profilePhoto,
        bio: session?.user?.bio || prev.bio || '',
        theme: session?.user?.theme || prev.theme || 'default',
        isOnline: session?.user?.isOnline ?? prev.isOnline ?? false,
        allowMessages: session?.user?.allowMessages ?? prev.allowMessages ?? true,
      }));
    }
  }, [session, status, setUserData]);

  useEffect(() => {
    if (status === 'authenticated') {
      const updateUserData = async () => {
        try {
          const response = await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userData: { ...userData, bio, theme, isOnline, allowMessages }, plants }),
          });
          if (!response.ok) throw new Error('Error al actualizar datos');
        } catch (error) {
          console.error('Error al persistir datos:', error);
        }
      };
      updateUserData();
    }
  }, [bio, theme, isOnline, allowMessages, status, userData, plants]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processPhoto(file);
    }
    setIsPhotoModalOpen(false);
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        processPhoto(file);
      }
      setIsPhotoModalOpen(false);
    };
    input.click();
  };

  const processPhoto = (file) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSize = 200;
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
        const resizedData = canvas.toDataURL('image/jpeg', 0.7);
        setUserData(prev => ({ ...prev, profilePhoto: resizedData }));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleEditSave = () => {
    setUserData(prev => ({ ...prev, bio, theme, isOnline, allowMessages }));
    setIsEditModalOpen(false);
  };

  const logout = () => {
    signOut({ redirect: true, callbackUrl: '/' }).then(() => {
      setUserData({ achievements: [], missionProgress: {}, profilePhoto: null, name: '', email: '', level: 0, xp: 0, newAchievements: 0, bio: '', theme: 'default', isOnline: false, allowMessages: true });
      setPlants([]);
    });
  };

  const handlePlantClick = (plantId) => {
    const index = plants.findIndex(plant => plant.id === plantId);
    if (index !== -1) {
      setActiveSection('plants');
      setPlants(prevPlants => {
        const updatedPlants = [...prevPlants];
        return updatedPlants;
      });
      setTimeout(() => {
        const plantElement = document.querySelector(`#plantList li:nth-child(${index + 1})`);
        if (plantElement) {
          plantElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const xpToNextLevel = () => {
    const levels = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];
    const currentXp = Number.isFinite(userData.xp) ? userData.xp : 0;
    const nextLevelIndex = (userData.level || 0) + 1;
    return levels[nextLevelIndex] || levels[10];
  };

  if (status === 'loading') {
    return <div className="text-center p-20 text-green-700 dark:text-green-300">Cargando...</div>;
  }

  return (
    <section id="profile" className={status === 'authenticated' ? '' : 'hidden'}>
      <div className="profile-header">
        <div className={`profile-card ${theme}`}>
          <div className="profile-top">
            <div className="profile-photo-wrapper">
              <div
                className="profile-photo"
                onClick={() => status === 'authenticated' ? setIsPhotoModalOpen(true) : alert("No puedes cambiar la foto sin estar autenticado.")}
                style={{ backgroundImage: userData.profilePhoto ? `url(${userData.profilePhoto})` : 'none' }}
              >
                {!userData.profilePhoto && (
                  <i className="fas fa-user" style={{ fontSize: '60px', color: '#4caf50' }}></i>
                )}
                <div className="photo-overlay">
                  <i className="fas fa-camera"></i>
                </div>
              </div>
              <span className="level-badge">{userData.level}</span>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{userData.name || 'Usuario no autenticado'}</h1>
              <p className="profile-bio">{bio || 'Añade una bio en Editar Perfil'}</p>
            </div>
            <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
          </div>
          <div className="xp-bar">
            <div
              className="xp-progress"
              style={{ width: `${(userData.xp / xpToNextLevel()) * 100}%` }}
            ></div>
            <span className="xp-text">{userData.xp} / {xpToNextLevel()} XP</span>
          </div>
          <button className="settings-btn" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            <i className="fas fa-cog"></i>
          </button>
          {isSettingsOpen && (
            <div className="settings-menu">
              <button className="menu-item" onClick={() => { setIsEditModalOpen(true); setIsSettingsOpen(false); }}>
                <i className="fas fa-edit"></i> Editar Perfil
              </button>
              <button className="menu-item" onClick={logout}>
                <i className="fas fa-sign-out-alt"></i> Finalizar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {isPhotoModalOpen && (
        <div className="photo-modal">
          <div className="photo-modal-content">
            <h3>Cambiar Foto de Perfil</h3>
            <button className="modal-btn" onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = handlePhotoChange;
              input.click();
            }}>
              <i className="fas fa-upload"></i> Cargar desde el sistema
            </button>
            <button className="modal-btn" onClick={handleCameraCapture}>
              <i className="fas fa-camera"></i> Tomar foto
            </button>
            <button className="modal-btn cancel-btn" onClick={() => setIsPhotoModalOpen(false)}>
              <i className="fas fa-times"></i> Cancelar
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="edit-modal">
          <div className="edit-modal-content animate-slide-in">
            <h3><i className="fas fa-user-edit"></i> Editar Perfil</h3>
            <div className="edit-field">
              <label>
                <i className="fas fa-comment"></i> Bio
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 100))}
                  maxLength={100}
                  placeholder="Describe algo sobre ti..."
                  className="bio-input"
                />
              </label>
            </div>
            <div className="edit-field">
              <label>
                <i className="fas fa-paint-brush"></i> Tema
                <select value={theme} onChange={(e) => setTheme(e.target.value)} className="theme-select">
                  <option value="default">Por defecto</option>
                  <option value="forest">Bosque</option>
                  <option value="sunset">Atardecer</option>
                </select>
              </label>
            </div>
            <div className="edit-field toggle-field">
              <label>
                <i className="fas fa-signal"></i> Estado
              </label>
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="isOnline"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                />
                <label htmlFor="isOnline" className="toggle-switch"></label>
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            <div className="edit-field toggle-field">
              <label>
                <i className="fas fa-envelope"></i> Permitir mensajes
              </label>
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="allowMessages"
                  checked={allowMessages}
                  onChange={(e) => setAllowMessages(e.target.checked)}
                />
                <label htmlFor="allowMessages" className="toggle-switch"></label>
                <span>{allowMessages ? 'Sí' : 'No'}</span>
              </div>
            </div>
            <div className="edit-actions">
              <button className="modal-btn save-btn" onClick={handleEditSave}>
                <i className="fas fa-save"></i> Guardar
              </button>
              <button className="modal-btn cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="profile-content">
        {/* Sección de Logros */}
        <div id="profileAchievements" className="achievements-list">
          {achievements.map((ach) => {
            const isUnlocked = userData.achievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`achievement ${isUnlocked ? 'unlocked' : 'locked'}`}
                data-tooltip={isUnlocked ? ach.name : ach.description}
              >
                <i className={ach.icon} style={{ fontSize: '32px' }}></i>
                <div className="achievement-header">
                  <p>{ach.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección de Plantas Públicas (Carrusel) */}
        <h3 className="section-title">
          <i className="fas fa-leaf"></i> Mis Plantas Públicas
        </h3>
        <div className="plants-gallery">
          {plants
            .filter((plant) => plant.isPublic)
            .map((plant) => (
              <div 
                key={plant.id} 
                className="plant-card"
                onClick={() => handlePlantClick(plant.id)}
              >
                <div
                  className="plant-background"
                  style={{ backgroundImage: `url(${plant.photo || '/default-plant.jpg'})` }}
                >
                  <div className="plant-info">
                    <h4>{plant.name}</h4>
                    <p>Fase: {plant.phase || 'Desconocida'}</p>
                    <i className="fas fa-lock-open"></i>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <button
          className="guides-btn"
          onClick={() => setActiveSection('guides')}
        >
          <i className="fas fa-book"></i> Ver Guías
        </button>
      </div>
    </section>
  );
}
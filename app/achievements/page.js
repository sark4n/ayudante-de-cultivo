"use client";

import { useState } from 'react';

export default function Achievements({ userData, setUserData, plants, queueNotification }) {
  const [achievements] = useState([
    { 
      id: "novato", 
      name: "Cultivador Novato", 
      color: "#CD7F32", 
      icon: "fas fa-seedling",
      missions: [
        { id: "addFirstPlant", name: "Agrega tu primera planta", completed: false, count: userData.missionProgress.addFirstPlant || 0, target: 1, icon: "fas fa-plus-circle" },
        { id: "addFirstUpdate", name: "Agrega tu primera actualización", completed: false, count: userData.missionProgress.addFirstUpdate || 0, target: 1, icon: "fas fa-sync-alt" },
        { id: "changePhase", name: "Cambia la fase de una planta", completed: false, count: userData.missionProgress.changePhase || 0, target: 1, icon: "fas fa-exchange-alt" },
        { id: "deletePlant", name: "Elimina una planta", completed: false, count: userData.missionProgress.deleteCount || 0, target: 1, icon: "fas fa-trash-alt" },
        { id: "plant30Days", name: "Mantén una planta activa 30 días", completed: false, count: userData.missionProgress.plant30Days || 0, target: 30, icon: "fas fa-calendar-check" }
      ]
    },
    { 
      id: "avanzado", 
      name: "Cultivador Avanzado", 
      color: "#C0C0C0", 
      icon: "fas fa-medal",
      missions: [
        { id: "addFivePlants", name: "Agrega 5 plantas", completed: false, count: userData.missionProgress.addFivePlants || 0, target: 5, icon: "fas fa-layer-group" },
        { id: "updateFivePlants", name: "Actualiza 5 plantas", completed: false, count: userData.missionProgress.updateFivePlants || 0, target: 5, icon: "fas fa-sync-alt" },
        { id: "fivePhases", name: "Usa 5 fases distintas o repetidas", completed: false, count: userData.missionProgress.fivePhases || 0, target: 5, icon: "fas fa-exchange-alt" },
        { id: "deleteFive", name: "Elimina 5 plantas o actualizaciones", completed: false, count: userData.missionProgress.deleteFive || 0, target: 5, icon: "fas fa-trash-alt" },
        { id: "plant90Days", name: "Mantén una planta activa 90 días", completed: false, count: userData.missionProgress.plant90Days || 0, target: 90, icon: "fas fa-calendar-check" }
      ]
    },
    { 
      id: "experto", 
      name: "Cultivador Experto", 
      color: "#FFD700", 
      icon: "fas fa-crown",
      missions: [
        { id: "addTenPlants", name: "Agrega 10 plantas", completed: false, count: userData.missionProgress.addTenPlants || 0, target: 10, icon: "fas fa-th-large" },
        { id: "updateTenPlants", name: "Actualiza 10 plantas", completed: false, count: userData.missionProgress.updateTenPlants || 0, target: 10, icon: "fas fa-sync-alt" },
        { id: "tenPhases", name: "Usa 10 fases distintas o repetidas", completed: false, count: userData.missionProgress.tenPhases || 0, target: 10, icon: "fas fa-exchange-alt" },
        { id: "deleteTen", name: "Elimina 10 plantas o actualizaciones", completed: false, count: userData.missionProgress.deleteTen || 0, target: 10, icon: "fas fa-trash-alt" },
        { id: "plant180Days", name: "Mantén una planta activa 180 días", completed: false, count: userData.missionProgress.plant180Days || 0, target: 180, icon: "fas fa-calendar-check" }
      ]
    }
  ]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const completeMission = (achievementId, missionId) => {
    const ach = achievements.find(a => a.id === achievementId);
    if (!ach) return;

    const mission = ach.missions.find(m => m.id === missionId);
    if (mission && mission.count >= mission.target && !mission.completed) {
      mission.completed = true;
      if (ach.missions.every(m => m.completed) && !userData.achievements.includes(achievementId)) {
        setUserData(prev => ({
          ...prev,
          achievements: [...prev.achievements, achievementId],
        }));
        queueNotification('achievement', ach.name, ach.icon, ach.id, ach.color);
      }
      setUserData(prev => ({ ...prev }));
    }
  };

  const resetAchievements = () => {
    setUserData({ ...userData, achievements: [], missionProgress: {} });
    setSelectedAchievement(null);
  };

  const completeAchievement = (id) => {
    const ach = achievements.find(a => a.id === id);
    if (ach && !userData.achievements.includes(id)) {
      ach.missions.forEach(m => {
        m.count = m.target;
        m.completed = true;
        queueNotification('mission', m.name);
      });
      setUserData(prev => ({
        ...prev,
        achievements: [...prev.achievements, id],
      }));
      queueNotification('achievement', ach.name, ach.icon, id, ach.color);
    }
  };

  return (
    <>
      <div id="achievementTitle" className="flex items-center gap-2 justify-center">
        <i className="fas fa-trophy" style={{ fontSize: '24px', color: '#4caf50' }}></i>
        <h2 className="text-24 font-bold text-green-700 dark:text-green-300">Mis Logros</h2>
      </div>
      <div id="achievementList">
        {!selectedAchievement ? (
          achievements.map(ach => {
            const isUnlocked = userData.achievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`achievement ${isUnlocked ? 'unlocked' : ''}`}
                data-id={ach.id}
                onClick={() => setSelectedAchievement(ach)}
              >
                <i className={ach.icon} style={{ fontSize: '32px', color: isUnlocked ? '#FFFFFF' : '#4caf50' }}></i>
                <div className="achievement-header">
                  <p>{ach.name}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="missions">
            <h3 className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <i className="fas fa-list" style={{ fontSize: '18px', color: '#4caf50' }}></i> Misiones para {selectedAchievement.name}
            </h3>
            <ul>
              {selectedAchievement.missions.map(mission => {
                const progress = Math.min((mission.count / mission.target) * 100, 100);
                const showCompleteButton = mission.count >= mission.target && !mission.completed;
                return (
                  <li key={mission.id} className={mission.completed ? 'completed' : ''}>
                    <i className={mission.icon} style={{ fontSize: '24px', color: '#4caf50' }}></i>
                    <div className="mission-content">
                      <span>{mission.name}</span>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: `${progress}%` }}></div>
                        <span className="progress-text">{Math.min(mission.count, mission.target)}/{mission.target}</span>
                      </div>
                    </div>
                    {showCompleteButton && (
                      <button
                        className="complete-mission-btn"
                        onClick={() => completeMission(selectedAchievement.id, mission.id)}
                      >
                        <i className="fas fa-check" style={{ fontSize: '14px' }}></i> Completar
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            <button
              className="bg-blue-500 text-white p-10 rounded-md hover:bg-blue-600 mt-4 flex items-center gap-5 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => setSelectedAchievement(null)}
            >
              <i className="fas fa-arrow-left"></i> Volver
            </button>
          </div>
        )}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={resetAchievements}
          className="bg-red-500 text-white p-10 rounded-md hover:bg-red-600 mr-2 dark:bg-red-600 dark:hover:bg-red-700"
        >
          Resetear Logros
        </button>
        {achievements.map(ach => (
          <button
            key={ach.id}
            onClick={() => completeAchievement(ach.id)}
            className="bg-green-500 text-white p-10 rounded-md hover:bg-green-600 mr-2 dark:bg-green-600 dark:hover:bg-green-700"
          >
            Obtener {ach.name}
          </button>
        ))}
      </div>
    </>
  );
}
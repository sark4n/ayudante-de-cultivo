"use client";

import { useState, useEffect } from 'react';

export default function Missions({ userData, setUserData, plants, queueNotification, achievementsData }) {
  const [activeTab, setActiveTab] = useState('daily');

  const dailyMissions = [
    { id: "checkPlant", name: "Chequear Planta", xp: 10, target: 1, icon: "fas fa-eye" },
    { id: "waterPlant", name: "Regar Planta", xp: 15, target: 1, icon: "fas fa-tint" },
    { id: "updatePlant", name: "Actualizar Planta", xp: 20, target: 1, icon: "fas fa-sync-alt" },
  ];

  const generalMissions = achievementsData.flatMap(ach => ach.missions);

  const completeMission = (missionId, xp, missionName) => {
    if (!userData.missionProgress[`${missionId}_completed`]) {
      setUserData(prev => {
        const validXp = Number.isFinite(xp) ? xp : 0;
        const newXp = (Number.isFinite(prev.xp) ? prev.xp : 0) + validXp;
        const levels = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];
        let newLevel = prev.level || 0;
        const newAchievements = [...(prev.achievements || [])];
        while (newXp >= levels[newLevel + 1] && newLevel < 10) {
          newLevel++;
          if (newLevel === 1 && !newAchievements.includes('novato')) {
            newAchievements.push('novato');
            queueNotification('achievement', 'Cultivador Novato', 'fas fa-seedling', 'novato', '#CD7F32');
          }
          if (newLevel === 5 && !newAchievements.includes('avanzado')) {
            newAchievements.push('avanzado');
            queueNotification('achievement', 'Cultivador Avanzado', 'fas fa-medal', 'avanzado', '#C0C0C0');
          }
          if (newLevel === 10 && !newAchievements.includes('experto')) {
            newAchievements.push('experto');
            queueNotification('achievement', 'Cultivador Experto', 'fas fa-crown', 'experto', '#FFD700');
          }
        }
        return {
          ...prev,
          missionProgress: { ...prev.missionProgress, [`${missionId}_completed`]: true },
          xp: newXp,
          level: newLevel,
          achievements: newAchievements,
        };
      });
      queueNotification('mission', missionName, 'fas fa-check');
    }
  };

  const resetMissions = () => {
    setUserData(prev => ({
      ...prev,
      missionProgress: {},
      xp: 0,
      level: 0,
      achievements: [],
      newAchievements: 0,
      pendingMissionCompletions: 0,
    }));
    alert("Misiones, XP, nivel y logros reseteados.");
  };

  const simulateProgress = () => {
    setUserData(prev => {
      const newMissionProgress = { ...prev.missionProgress };
      dailyMissions.forEach(mission => {
        newMissionProgress[mission.id] = mission.target;
      });
      generalMissions.forEach(mission => {
        newMissionProgress[mission.id] = mission.target;
      });
      return {
        ...prev,
        missionProgress: newMissionProgress,
      };
    });
    alert("Progreso simulado: todas las misiones están listas para completarse.");
  };

  useEffect(() => {
    const allMissions = [...dailyMissions, ...generalMissions];
    allMissions.forEach(mission => {
      const progress = userData.missionProgress[mission.id] || 0;
      const completed = userData.missionProgress[`${mission.id}_completed`] || false;
      const notified = userData.missionProgress[`${mission.id}_notified`] || false;
      if (progress >= mission.target && !completed && !notified) {
        queueNotification('mission', mission.name, mission.icon);
        setUserData(prev => ({
          ...prev,
          missionProgress: { 
            ...prev.missionProgress, 
            [`${mission.id}_notified`]: true,
            [mission.id]: progress
          },
        }));
      }
    });
  }, [userData.missionProgress, queueNotification, setUserData]);

  const renderMissions = (missions) => (
    <ul>
      {missions.map(mission => {
        const progress = userData.missionProgress[mission.id] || 0;
        const completed = userData.missionProgress[`${mission.id}_completed`] || false;
        const showCompleteButton = progress >= mission.target && !completed;
        console.log(`Misión ${mission.id}: progress=${progress}, target=${mission.target}, completed=${completed}, showCompleteButton=${showCompleteButton}`);
        return (
          <li key={mission.id} className={completed ? 'completed' : ''}>
            <i className={mission.icon}></i>
            <div className="mission-content">
              <span>{mission.name} (+{mission.xp || 0} XP)</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${Math.min((progress / mission.target) * 100, 100)}%` }}></div>
                <span className="progress-text">{Math.min(progress, mission.target)}/{mission.target}</span>
              </div>
              {showCompleteButton && <span className="mission-notification-dot"></span>}
            </div>
            {showCompleteButton && (
              <button
                className="complete-mission-btn"
                onClick={() => completeMission(mission.id, mission.xp || 0, mission.name)}
              >
                Completar
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div id="missions">
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Misiones Diarias
        </button>
        <button
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          Misiones Generales
        </button>
      </div>
      <div className="test-buttons">
        <button onClick={resetMissions} className="reset-btn">
          Resetear Misiones
        </button>
        <button onClick={simulateProgress} className="simulate-btn">
          Simular Progreso
        </button>
      </div>
      {activeTab === 'daily' ? (
        <div className="missions daily-missions">
          <h3 className="text-green-700 text-20 font-bold dark:text-green-300">Misiones Diarias</h3>
          {renderMissions(dailyMissions)}
        </div>
      ) : (
        <div className="missions general-missions">
          <h3 className="text-green-700 text-20 font-bold dark:text-green-300">Misiones Generales</h3>
          {renderMissions(generalMissions)}
        </div>
      )}
    </div>
  );
}
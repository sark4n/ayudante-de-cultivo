"use client";

import { useState, useEffect } from 'react';

export default function Achievements({
  userData,
  setUserData,
  plants,
  queueNotification,
  setSelectedAchievement,
  selectedAchievement,
}) {
  const [achievements, setAchievements] = useState([]);
  const [localSelectedAchievement, setLocalSelectedAchievement] = useState(selectedAchievement);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements');
        const data = await response.json();
        setAchievements(data);
        if (selectedAchievement) {
          const updatedSelected = data.find(ach => ach.id === selectedAchievement.id);
          setLocalSelectedAchievement(updatedSelected || null);
        }
      } catch (error) {
        console.error("Error al cargar logros:", error);
      }
    };
    fetchAchievements();
  }, [selectedAchievement]);

  const updateAchievements = () => {
    return achievements.map(ach => ({
      ...ach,
      missions: ach.missions.map(m => ({
        ...m,
        count: userData.missionProgress[m.id] || 0,
        completed: userData.missionProgress[`${m.id}_completed`] || false
      }))
    }));
  };

  const [currentAchievements, setCurrentAchievements] = useState([]);

  useEffect(() => {
    if (achievements.length > 0) {
      const updatedAchievements = updateAchievements();
      setCurrentAchievements(updatedAchievements);

      if (localSelectedAchievement) {
        const updatedSelected = updatedAchievements.find(ach => ach.id === localSelectedAchievement.id);
        setLocalSelectedAchievement(updatedSelected);
      }

      achievements.forEach(ach => {
        ach.missions.forEach(mission => {
          const currentCount = userData.missionProgress[mission.id] || 0;
          if (currentCount >= mission.target && !userData.missionProgress[`${mission.id}_notified`]) {
            queueNotification('mission', mission.name, mission.icon);
            setUserData(prev => ({
              ...prev,
              missionProgress: { ...prev.missionProgress, [`${mission.id}_notified`]: true }
            }));
          }
        });
      });
    }
  }, [userData.missionProgress, userData.achievements, plants, setUserData, queueNotification, achievements]);

  const completeMission = (achievementId, missionId) => {
    const ach = achievements.find(a => a.id === achievementId);
    const mission = ach.missions.find(m => m.id === missionId);
    if (mission && userData.missionProgress[missionId] >= mission.target && !userData.missionProgress[`${missionId}_completed`]) {
      setUserData(prev => ({
        ...prev,
        missionProgress: {
          ...prev.missionProgress,
          [`${missionId}_completed`]: true
        }
      }));
    }
  };

  const resetMissions = () => {
    setUserData(prev => ({ ...prev, achievements: [], missionProgress: {} }));
    setLocalSelectedAchievement(null);
    setSelectedAchievement(null);
  };

  const completeAchievement = (achievementId) => {
    const ach = achievements.find(a => a.id === achievementId);
    if (ach && !userData.achievements.includes(achievementId)) {
      setUserData(prev => {
        const updatedProgress = { ...prev.missionProgress };
        ach.missions.forEach(m => {
          updatedProgress[m.id] = m.target;
          updatedProgress[`${m.id}_completed`] = true;
          updatedProgress[`${m.id}_notified`] = true;
        });
        queueNotification('achievement', ach.name, ach.icon, ach.id, ach.color);
        return {
          ...prev,
          missionProgress: updatedProgress,
          achievements: [...prev.achievements, achievementId]
        };
      });
    }
  };

  return (
    <div id="achievementList">
      {!localSelectedAchievement ? (
        currentAchievements.map(ach => {
          const isUnlocked = userData.achievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`achievement ${isUnlocked ? 'unlocked' : ''}`}
              data-id={ach.id}
              onClick={() => {
                setLocalSelectedAchievement(ach);
                setSelectedAchievement(ach);
              }}
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
          <h3 className="text-green-700 text-20 font-bold dark:text-green-300">
            Misiones para {localSelectedAchievement.name}
          </h3>
          <ul>
            {localSelectedAchievement.missions.map(mission => {
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
                      className="complete-mission-btn bg-green-500 text-white p-5 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                      onClick={() => completeMission(localSelectedAchievement.id, mission.id)}
                    >
                      Completar Misión
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={resetMissions}
          className="bg-red-500 text-white p-10 rounded-md hover:bg-red-600 mr-2 dark:bg-red-600 dark:hover:bg-red-700"
        >
          Resetear Misiones
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
    </div>
  );
}
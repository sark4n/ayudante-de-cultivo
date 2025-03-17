export default function PlantList({ 
  plants, 
  isFormVisible, 
  isEditFormVisible, 
  isUpdateFormVisible, 
  setSelectedPlant, 
  setEditPlantIndex, 
  setIsEditFormVisible, 
  deletePlant, 
  getCurrentPhase,
  userData,
  setUserData,
  queueNotification,
  setPlants
}) {
  const filteredPlants = plants.filter(p => !p.notes.includes("Ejemplo inicial"));
  
  const getLastUpdateDate = (plant) => {
    if (plant.updates && plant.updates.length > 0) {
      const latestUpdate = plant.updates.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
      });
      return new Date(latestUpdate.date).toLocaleDateString();
    }
    return new Date(plant.startDate).toLocaleDateString();
  };
  
  const handlePlantClick = (index) => {
    setSelectedPlant(index);
  };

  const getTimeRemaining = (lastAction) => {
    const lastActionTime = new Date(lastAction);
    const nextActionTime = new Date(lastActionTime.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const timeDiff = nextActionTime - now;

    if (timeDiff <= 0) return "0h 0m";
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleWaterPlant = (plant, index) => {
    const today = new Date().toLocaleDateString();
    const now = new Date();
    const lastWatered = plant.lastWatered || null;

    if (lastWatered && new Date(lastWatered).toLocaleDateString() === today) {
      const timeRemaining = getTimeRemaining(lastWatered);
      queueNotification('warning', `Ya regaste ${plant.name} hoy, riega nuevamente en ${timeRemaining}`, 'fas fa-exclamation-triangle');
      return;
    }

    setUserData(prev => {
      const missionProgress = { ...prev.missionProgress };
      const currentProgress = missionProgress["waterPlant"] || 0;
      if (currentProgress < 1) {
        missionProgress["waterPlant"] = 1;
      }
      return { ...prev, missionProgress };
    });

    setPlants(prevPlants => {
      const updatedPlants = [...prevPlants];
      updatedPlants[index] = { ...updatedPlants[index], lastWatered: now.toISOString() };
      return updatedPlants;
    });

    queueNotification('mission', `${plant.name} Riego Exitoso`, 'fas fa-tint');
  };

  const handleCheckPlant = (index) => {
    const today = new Date().toLocaleDateString();
    const now = new Date();
    const plant = plants[index];
    const lastChecked = plant.lastChecked || null;

    if (lastChecked && new Date(lastChecked).toLocaleDateString() === today) {
      const timeRemaining = getTimeRemaining(lastChecked);
      queueNotification('warning', `Ya chequeaste ${plant.name} hoy, chequea nuevamente en ${timeRemaining}`, 'fas fa-exclamation-triangle');
      return;
    }

    setUserData(prev => {
      const missionProgress = { ...prev.missionProgress };
      const currentProgress = missionProgress["checkPlant"] || 0;
      if (currentProgress < 1) {
        missionProgress["checkPlant"] = 1;
        queueNotification('mission', 'Chequear Planta', 'fas fa-eye');
      }
      return { ...prev, missionProgress };
    });

    setPlants(prevPlants => {
      const updatedPlants = [...prevPlants];
      updatedPlants[index] = { ...updatedPlants[index], lastChecked: now.toISOString() };
      return updatedPlants;
    });

    setSelectedPlant(index);
  };

  const handleUpdatePlant = (plant, index) => {
    const today = new Date().toLocaleDateString();
    const isUpdatedToday = plant.lastUpdated && new Date(plant.lastUpdated).toLocaleDateString() === today;

    if (isUpdatedToday) {
      const timeRemaining = getTimeRemaining(plant.lastUpdated);
      queueNotification('warning', `Ya actualizaste ${plant.name} hoy, actualiza nuevamente en ${timeRemaining}`, 'fas fa-exclamation-triangle');
    } else {
      setSelectedPlant(index);
    }
  };

  const handleTogglePublic = (index) => {
    setPlants(prevPlants => {
      const updatedPlants = [...prevPlants];
      const plant = updatedPlants[index];
      updatedPlants[index] = { ...plant, isPublic: !plant.isPublic };
      queueNotification('info', `${plant.name} ahora es ${!plant.isPublic ? 'privada' : 'pública'}`, `fas fa-lock${!plant.isPublic ? '' : '-open'}`);
      return updatedPlants;
    });
  };

  if (filteredPlants.length === 0 && !isFormVisible && !isEditFormVisible && !isUpdateFormVisible) {
    return (
      <ul id="plantList">
        <li className="empty-card">
          <i className="fas fa-box-open"></i>
          <p>¡Aún no hay plantas por aquí!</p>
          <p>Toca la hoja para agregar una nueva planta</p>
        </li>
      </ul>
    );
  }
  
  return (
    <ul id="plantList">
      {filteredPlants.slice(0, 5).map((plant, index) => {
        const today = new Date().toLocaleDateString();
        const isWateredToday = plant.lastWatered && new Date(plant.lastWatered).toLocaleDateString() === today;
        const isCheckedToday = plant.lastChecked && new Date(plant.lastChecked).toLocaleDateString() === today;
        const isUpdatedToday = plant.lastUpdated && new Date(plant.lastUpdated).toLocaleDateString() === today;
        const isPublic = plant.isPublic || false;

        return (
          <li
            key={index}
            onClick={() => handlePlantClick(index)}
            className="plant-card-clickable"
            style={{ backgroundImage: plant.photo ? `url(${plant.photo})` : 'none' }}
          >
            <div className="plant-content">
              <div className="plant-info">
                <h3><i className="fas fa-leaf"></i> {plant.name}</h3>
                <p><strong>Tipo:</strong> {plant.type}</p>
                <p><strong>Inicio:</strong> {plant.startDate}</p>
                <p><strong>Fase Actual:</strong> {getCurrentPhase(plant)}</p>
                <p><strong>Última Actualización:</strong> {getLastUpdateDate(plant)}</p>
                <p><strong>Notas:</strong> {plant.notes || 'Sin notas'}</p>
              </div>
              <div className="plant-actions">
                <div className="btn-group">
                  <button 
                    className={`water plant-btn ${isWateredToday ? 'watered' : ''}`} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleWaterPlant(plant, index); 
                    }}
                  >
                    <i className="fas fa-tint"></i>
                  </button>
                  <button 
                    className={`check plant-btn ${isCheckedToday ? 'checked' : ''}`} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleCheckPlant(index); 
                    }}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className={`update plant-btn ${isUpdatedToday ? 'updated' : ''}`} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleUpdatePlant(plant, index); 
                    }}
                  >
                    <i className="fas fa-sync-alt"></i>
                  </button>
                  <button 
                    className={`public plant-btn ${isPublic ? 'public-on' : 'public-off'}`} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleTogglePublic(index); 
                    }}
                  >
                    <i className={`fas fa-lock${isPublic ? '-open' : ''}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
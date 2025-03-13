export default function PlantList({ 
    plants, 
    isFormVisible, 
    isEditFormVisible, 
    isUpdateFormVisible, 
    setSelectedPlant, 
    setEditPlantIndex, 
    setIsEditFormVisible, 
    deletePlant, 
    getCurrentPhase 
  }) {
    const filteredPlants = plants.filter(p => !p.notes.includes("Ejemplo inicial"));
    
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
        {filteredPlants.slice(0, 5).map((plant, index) => (
          <li
            key={index}
            onClick={() => setSelectedPlant(index)}
            className="plant-card-clickable"
          >
            <div className="plant-content">
              <div className="plant-info">
                <h3><i className="fas fa-leaf"></i> {plant.name} ({plant.type})</h3>
                <p><strong>Inicio:</strong> {plant.startDate}</p>
                <p><strong>Fase Actual:</strong> {getCurrentPhase(plant)}</p>
                <p><strong>Notas:</strong> {plant.notes || 'Sin notas'}</p>
              </div>
              <div className="plant-actions">
                <div className="btn-group">
                  <button className="edit plant-btn" onClick={(e) => { 
                    e.stopPropagation(); 
                    setEditPlantIndex(index); 
                    setIsEditFormVisible(true); 
                  }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="delete plant-btn" onClick={(e) => { 
                    e.stopPropagation(); 
                    deletePlant(index); 
                  }}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                {plant.photo && 
                  <img 
                    src={plant.photo} 
                    alt={plant.name} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      window.showImage(plant.photo); 
                    }} 
                  />
                }
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
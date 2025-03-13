import PlantForm from './PlantForm';
import UpdateForm from './UpdateForm';

export default function PlantDetail({ 
  plant, 
  selectedPlant, 
  userData, 
  getCurrentPhase, 
  setActiveSection, 
  setEditPlantIndex, 
  setIsEditFormVisible, 
  deletePlant, 
  addUpdate, 
  deleteUpdate, 
  setUpdatePlantIndex, 
  setEditUpdateIndex, 
  setIsUpdateFormVisible, 
  isEditFormVisible, 
  plants, 
  editPlantIndex, 
  saveEditPlant, 
  isUpdateFormVisible, 
  updatePlantIndex, 
  editUpdateIndex, 
  initialUpdateData, 
  saveUpdate 
}) {
  const currentPhase = getCurrentPhase(plant);
  
  return (
    <div className="plant-detail">
      <div className="plant-content">
        <div className="plant-info">
          <h3><i className="fas fa-leaf"></i> {plant.name} ({plant.type})</h3>
          <p><strong>Inicio:</strong> {plant.startDate}</p>
          <p><strong>Fase Actual:</strong> {currentPhase}</p>
          <p><strong>Notas:</strong> {plant.notes || 'Sin notas'}</p>
        </div>
        <div className="plant-actions">
          <div className="btn-group">
            <button className="add-update plant-btn" onClick={() => addUpdate(selectedPlant)}>
              <i className="fas fa-plus"></i>
            </button>
            <button 
              className={`stats ${userData.level >= 10 ? 'expert plant-btn' : 'locked plant-btn'}`} 
              onClick={() => setActiveSection('stats')}
            >
              <i className="fas fa-chart-bar"></i>
            </button>
            <button className="edit plant-btn" onClick={() => { 
              setEditPlantIndex(selectedPlant); 
              setIsEditFormVisible(true); 
            }}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="delete plant-btn" onClick={() => deletePlant(selectedPlant)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
          {plant.photo && 
            <img 
              src={plant.photo} 
              alt={plant.name} 
              onClick={() => window.showImage(plant.photo)} 
            />
          }
        </div>
      </div>
      
      <div className="updates">
        <h3><i className="fas fa-history"></i> Cronología</h3>
        {plant.updates && plant.updates.length > 0 ? (
          plant.updates.map((update, updateIndex) => (
            <div className="update-card" key={updateIndex}>
              <div className="update-info">
                <p className="phase">{update.phase ? `(${update.phase})` : ''}</p>
                <p>
                  {update.notes || ''} 
                  {update.temperature ? `${update.temperature}°C` : ''} 
                  {update.humidity ? `${update.humidity}%` : ''}
                </p>
                <p className="date">{update.date}</p>
              </div>
              <div className="update-actions">
                {update.photo && 
                  <img 
                    src={update.photo} 
                    alt="Actualización" 
                    onClick={() => window.showImage(update.photo)} 
                  />
                }
                <div className="btn-group">
                  <button className="edit plant-btn" onClick={() => { 
                    setUpdatePlantIndex(selectedPlant); 
                    setEditUpdateIndex(updateIndex); 
                    setIsUpdateFormVisible(true); 
                  }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="delete plant-btn" onClick={() => deleteUpdate(selectedPlant, updateIndex)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay actualizaciones aún.</p>
        )}
      </div>
      
      {isEditFormVisible && (
        <PlantForm
          onSubmit={saveEditPlant}
          onCancel={() => setIsEditFormVisible(false)}
          initialData={plants[editPlantIndex]}
          title="Editar Planta"
          icon="fas fa-edit"
        />
      )}
      
      {isUpdateFormVisible && (
        <UpdateForm
          onSubmit={saveUpdate}
          onCancel={() => setIsUpdateFormVisible(false)}
          initialData={editUpdateIndex !== null ? plants[updatePlantIndex].updates[editUpdateIndex] : initialUpdateData}
          isEdit={editUpdateIndex !== null}
        />
      )}
    </div>
  );
}
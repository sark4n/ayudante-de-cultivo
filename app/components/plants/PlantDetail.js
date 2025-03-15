import { useState } from 'react';
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
  saveUpdate,
  setPlants,
  setSelectedPlant,
  setUserData,
  queueNotification
}) {
  const currentPhase = getCurrentPhase(plant);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState(plant.photos || [plant.photo].filter(Boolean));
  
  const getLastUpdateDate = (plant) => {
    if (plant.updates && plant.updates.length > 0) {
      const latestUpdate = plant.updates.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
      });
      return new Date(latestUpdate.date).toLocaleDateString();
    }
    return new Date(plant.startDate).toLocaleDateString();
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = event.target.result;
        const updatedImages = [...galleryImages, newImage];
        setGalleryImages(updatedImages);
        setPlants(prevPlants => {
          const updatedPlants = [...prevPlants];
          updatedPlants[selectedPlant] = { ...updatedPlants[selectedPlant], photos: updatedImages };
          return updatedPlants;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseGallery = (e) => {
    if (e.target.className === 'plant-gallery') {
      setIsGalleryOpen(false);
    }
  };

  const handleSaveUpdate = (e, updateData) => {
    // Guardamos el update sin restricciones de tiempo
    saveUpdate(e, updateData);

    // Actualizamos lastUpdated y la misión (sin chequeo de 24 horas)
    const now = new Date();
    setPlants(prevPlants => {
      const updatedPlants = [...prevPlants];
      updatedPlants[selectedPlant] = { ...updatedPlants[selectedPlant], lastUpdated: now.toISOString() };
      return updatedPlants;
    });

    setUserData(prev => {
      const missionProgress = { ...prev.missionProgress };
      const currentProgress = missionProgress["updatePlant"] || 0;
      if (currentProgress < 1) {
        missionProgress["updatePlant"] = 1;
        queueNotification('mission', 'Actualizar Planta', 'fas fa-sync-alt');
      }
      return { ...prev, missionProgress };
    });
  };

  return (
    <div className="plant-detail">
      <div 
        className="plant-content"
        style={{ backgroundImage: plant.photo ? `url(${plant.photo})` : 'none' }}
      >
        <div className="plant-info">
          <h3><i className="fas fa-leaf"></i> {plant.name} ({plant.type})</h3>
          <p><strong>Inicio:</strong> {plant.startDate}</p>
          <p><strong>Fase Actual:</strong> {currentPhase}</p>
          <p><strong>Última Actualización:</strong> {getLastUpdateDate(plant)}</p>
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
            <button className="gallery plant-btn" onClick={() => setIsGalleryOpen(true)}>
              <i className="fa-solid fa-images"></i>
            </button>
            <button className="delete plant-btn" onClick={() => deletePlant(selectedPlant)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      {isGalleryOpen && (
        <div className="plant-gallery" onClick={handleCloseGallery}>
          <div className="gallery-content">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="gallery-image"
                style={{ backgroundImage: `url(${image})` }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.showImage(image);
                }}
              />
            ))}
            <label className="gallery-add">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAddImage} 
                style={{ display: 'none' }}
              />
              <i className="fas fa-plus"></i>
            </label>
          </div>
        </div>
      )}
      
      <div className="updates">
        <h3><i className="fas fa-history"></i> Cronología</h3>
        {plant.updates && plant.updates.length > 0 ? (
          plant.updates.map((update, updateIndex) => (
            <div 
              className="update-card" 
              key={updateIndex}
              style={{ backgroundImage: update.photo ? `url(${update.photo})` : 'none' }}
            >
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
          onSubmit={handleSaveUpdate}
          onCancel={() => setIsUpdateFormVisible(false)}
          initialData={editUpdateIndex !== null ? plants[updatePlantIndex].updates[editUpdateIndex] : initialUpdateData}
          isEdit={editUpdateIndex !== null}
        />
      )}
    </div>
  );
}
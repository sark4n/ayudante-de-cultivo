"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { resizeImage } from '../lib/navigation';

function PlantForm({ onSubmit, onCancel, initialData, title, icon }) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues: initialData });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 300, 300).then((resizedData) => {
        setValue('photo', resizedData);
      });
    }
  };

  return (
    <form
      className="form-overlay"
      onSubmit={handleSubmit((data) => onSubmit({ preventDefault: () => {} }, data))}
    >
      <div className="plant-form">
        <h2>
          <i className={icon}></i> {title}
        </h2>
        <div className="form-content">
          <div className="form-field">
            <label><i className="fas fa-pen"></i> Nombre</label>
            <input {...register('name', { required: true })} placeholder="Nombre de la planta" />
          </div>
          <div className="form-field">
            <label><i className="fas fa-calendar-alt"></i> Fecha de Inicio</label>
            <input type="date" {...register('startDate', { required: true })} />
          </div>
          <div className="form-field">
            <label><i className="fas fa-seedling"></i> Tipo de Planta</label>
            <select {...register('type', { required: true })}>
              <option value="">Selecciona un tipo</option>
              <option value="indica">Indica</option>
              <option value="sativa">Sativa</option>
              <option value="hybrid">Híbrida</option>
              <option value="otra">Otra</option>
            </select>
          </div>
          <div className="form-field">
            <label><i className="fas fa-leaf"></i> Fase Actual</label>
            <select {...register('phase', { required: true })}>
              <option value="">Selecciona una fase</option>
              <option value="semilla">Semilla</option>
              <option value="vegetativa">Vegetativa</option>
              <option value="floracion">Floración</option>
            </select>
          </div>
          <div className="form-field">
            <label><i className="fas fa-thermometer-half"></i> Temperatura (°C)</label>
            <input type="number" {...register('temperature')} placeholder="Ej: 25.5" step="0.1" min="0" max="50" />
          </div>
          <div className="form-field">
            <label><i className="fas fa-tint"></i> Humedad (%)</label>
            <input type="number" {...register('humidity')} placeholder="Ej: 60" step="1" min="0" max="100" />
          </div>
          <div className="form-field">
            <label><i className="fas fa-camera"></i> Foto</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </div>
          <div className="form-field-start">
            <label><i className="fas fa-sticky-note"></i> Notas</label>
            <textarea {...register('notes')} placeholder="Añade notas sobre tu planta"></textarea>
          </div>
        </div>
        <div className="form-buttons">
          <button type="button" onClick={onCancel} className="plant-btn"><i className="fas fa-times"></i> Cancelar</button>
          <button type="submit" className="plant-btn"><i className="fas fa-save"></i> Guardar</button>
        </div>
      </div>
    </form>
  );
}

function UpdateForm({ onSubmit, onCancel, initialData, isEdit }) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues: initialData });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 300, 300).then((resizedData) => {
        setValue('photo', resizedData);
      });
    }
  };

  return (
    <form
      className="form-overlay"
      onSubmit={handleSubmit((data) => onSubmit({ preventDefault: () => {} }, data))}
    >
      <div className="plant-form">
        <h2>
          <i className={isEdit ? 'fas fa-edit' : 'fas fa-plus'}></i> {isEdit ? 'Editar Actualización' : 'Agregar Actualización'}
        </h2>
        <div className="form-content">
          <div className="form-field">
            <label><i className="fas fa-calendar-alt"></i> Fecha:</label>
            <input type="date" {...register('date', { required: true })} />
          </div>
          <div className="form-field">
            <label><i className="fas fa-leaf"></i> Fase:</label>
            <select {...register('phase', { required: true })}>
              <option value="">Fase actual</option>
              <option value="semilla">Semilla</option>
              <option value="vegetativa">Vegetativa</option>
              <option value="floracion">Floración</option>
            </select>
          </div>
          <div className="form-field">
            <label><i className="fas fa-thermometer-half"></i> Temperatura (°C):</label>
            <input type="number" {...register('temperature')} placeholder="Temperatura (°C)" step="0.1" min="0" max="50" />
          </div>
          <div className="form-field">
            <label><i className="fas fa-tint"></i> Humedad (%):</label>
            <input type="number" {...register('humidity')} placeholder="Humedad (%)" step="1" min="0" max="100" />
          </div>
          <div className="form-field-start">
            <label><i className="fas fa-sticky-note"></i> Notas:</label>
            <textarea {...register('notes')} placeholder="Notas"></textarea>
          </div>
          <div className="form-field">
            <label><i className="fas fa-camera"></i> Foto:</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="plant-btn"><i className={isEdit ? 'fas fa-save' : 'fas fa-plus'}></i> {isEdit ? 'Editar' : 'Agregar'}</button>
          <button type="button" onClick={onCancel} className="plant-btn"><i className="fas fa-times"></i> Cancelar</button>
        </div>
      </div>
    </form>
  );
}

export default function Plants({ plants, setPlants, userData, setUserData, setActiveSection, queueNotification }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [editPlantIndex, setEditPlantIndex] = useState(null);
  const [updatePlantIndex, setUpdatePlantIndex] = useState(null);
  const [editUpdateIndex, setEditUpdateIndex] = useState(null);

  const initialPlantData = {
    name: '',
    startDate: '',
    type: '',
    phase: '',
    temperature: '',
    humidity: '',
    notes: '',
    photo: null,
    updates: [],
  };

  const initialUpdateData = {
    date: new Date().toISOString().split('T')[0],
    phase: '',
    temperature: '',
    humidity: '',
    notes: '',
    photo: null,
  };

  const savePlant = (e, newPlant) => {
    e.preventDefault();
    const userPlants = plants.filter(p => !p.notes.includes("Ejemplo inicial"));
    if (userPlants.length >= 5) {
      alert('Límite temporal de 5 plantas alcanzado.');
      return;
    }
    setPlants(prev => [...prev, newPlant]);
    updateUserData('addPlant');
    setIsFormVisible(false);
  };

  const saveEditPlant = (e, editedPlant) => {
    e.preventDefault();
    const updatedPlants = [...plants];
    const oldPhase = updatedPlants[editPlantIndex].phase;
    updatedPlants[editPlantIndex] = editedPlant;
    setPlants(updatedPlants);
    if (oldPhase !== editedPlant.phase) updateUserData('editPlant');
    setIsEditFormVisible(false);
    setEditPlantIndex(null);
  };

  const deletePlant = (index) => {
    setPlants(prev => prev.filter((_, i) => i !== index));
    updateUserData('deletePlant');
  };

  const addUpdate = (index) => {
    setIsUpdateFormVisible(true);
    setUpdatePlantIndex(index);
    setEditUpdateIndex(null);
    const plant = plants[index];
    initialUpdateData.phase = plant.phase || '';
    initialUpdateData.temperature = plant.temperature || '';
    initialUpdateData.humidity = plant.humidity || '';
  };

  const saveUpdate = (e, update) => {
    e.preventDefault();
    const updatedPlants = [...plants];
    const plant = updatedPlants[updatePlantIndex];
    if (!plant.updates) plant.updates = [];
    if (editUpdateIndex !== null) {
      plant.updates[editUpdateIndex] = update;
    } else {
      plant.updates.push(update);
      updateUserData('addUpdate');
    }
    setPlants(updatedPlants);
    setIsUpdateFormVisible(false);
    setUpdatePlantIndex(null);
    setEditUpdateIndex(null);
  };

  const deleteUpdate = (plantIndex, updateIndex) => {
    const updatedPlants = [...plants];
    updatedPlants[plantIndex].updates.splice(updateIndex, 1);
    setPlants(updatedPlants);
    updateUserData('deleteUpdate');
  };

  const updateUserData = (action) => {
    let totalUpdates = 0;
    let uniqueUpdatedPlants = new Set();
    let deleteCount = userData.missionProgress.deleteCount || 0;
    let maxPlantDays = 0;

    plants.forEach(plant => {
      if (!plant.notes.includes("Ejemplo inicial")) {
        const startDate = new Date(plant.startDate);
        let latestUpdateDate = startDate;
        if (plant.updates && plant.updates.length > 0) {
          latestUpdateDate = new Date(Math.max(...plant.updates.map(u => new Date(u.date))));
        }
        const daysActive = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
        maxPlantDays = Math.max(maxPlantDays, daysActive);
      }
      totalUpdates += plant.updates ? plant.updates.length : 0;
      if (plant.updates && plant.updates.length > 0) uniqueUpdatedPlants.add(plant.name);
    });
    const activePlants = plants.filter(p => !p.notes.includes("Ejemplo inicial")).length;

    setUserData(prev => {
      const missionProgress = { ...prev.missionProgress };
      if (action === 'addPlant') {
        missionProgress.addFirstPlant = Math.min((missionProgress.addFirstPlant || 0) + 1, 1);
        if (missionProgress.addFirstPlant === 1 && !missionProgress.addFirstPlant_notified) {
          queueNotification('mission', 'Agrega tu primera planta', 'fas fa-plus-circle');
          missionProgress.addFirstPlant_notified = true;
        }
      }
      if (action === 'addUpdate') missionProgress.addFirstUpdate = Math.min((missionProgress.addFirstUpdate || 0) + 1, 1);
      if (action === 'editPlant') missionProgress.changePhase = Math.min((missionProgress.changePhase || 0) + 1, 1);
      if (action === 'deletePlant') missionProgress.deletePlant = Math.min((missionProgress.deletePlant || 0) + 1, 1);
      if (action === 'deletePlant' || action === 'deleteUpdate') missionProgress.deleteCount = deleteCount + 1;
      missionProgress.plant30Days = Math.min(maxPlantDays, 30);
      missionProgress.plant90Days = Math.min(maxPlantDays, 90);
      missionProgress.plant180Days = Math.min(maxPlantDays, 180);
      if (action === 'addPlant') missionProgress.addFivePlants = Math.min(activePlants, 5);
      if (action === 'addUpdate') missionProgress.updateFivePlants = Math.min(uniqueUpdatedPlants.size, 5);
      if (action === 'editPlant') missionProgress.fivePhases = Math.min((missionProgress.fivePhases || 0) + 1, 5);
      if (action === 'deletePlant' || action === 'deleteUpdate') missionProgress.deleteFive = Math.min(missionProgress.deleteCount, 5);
      if (action === 'addPlant') missionProgress.addTenPlants = Math.min(activePlants, 10);
      if (action === 'addUpdate') missionProgress.updateTenPlants = Math.min(uniqueUpdatedPlants.size, 10);
      if (action === 'editPlant') missionProgress.tenPhases = Math.min((missionProgress.tenPhases || 0) + 1, 10);
      if (action === 'deletePlant' || action === 'deleteUpdate') missionProgress.deleteTen = Math.min(missionProgress.deleteCount, 10);
      return { ...prev, missionProgress };
    });
  };

  return (
    <>
      <button
        onClick={() => setIsFormVisible(true)}
        id="addPlantBtn"
        className={isFormVisible || isEditFormVisible || isUpdateFormVisible ? 'hidden' : 'plant-btn'}
      >
        <i className="fas fa-leaf" style={{ fontSize: '24px' }}></i>
      </button>
      {isFormVisible && (
        <PlantForm
          onSubmit={savePlant}
          onCancel={() => setIsFormVisible(false)}
          initialData={initialPlantData}
          title="Agregar Nueva Planta"
          icon="fas fa-leaf"
        />
      )}
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
      <ul id="plantList">
        {plants.filter(p => !p.notes.includes("Ejemplo inicial")).length === 0 && !isFormVisible && !isEditFormVisible && !isUpdateFormVisible ? (
          <li className="empty-card">
            <i className="fas fa-box-open"></i>
            <p>¡Aún no hay plantas por aquí!</p>
            <p>Toca la hoja para agregar una nueva planta</p>
          </li>
        ) : (
          plants.filter(p => !p.notes.includes("Ejemplo inicial")).slice(0, 5).map((plant, index) => (
            <li key={index}>
              <div className="plant-content">
                <div className="plant-info">
                  <h3><i className="fas fa-leaf"></i> {plant.name} ({plant.type})</h3>
                  <p><strong>Inicio:</strong> {plant.startDate}</p>
                  <p><strong>Fase:</strong> {plant.phase || 'Sin fase'}</p>
                  {plant.temperature && <p><strong>Temperatura:</strong> {plant.temperature}°C</p>}
                  {plant.humidity && <p><strong>Humedad:</strong> {plant.humidity}%</p>}
                  <p><strong>Notas:</strong> {plant.notes || 'Sin notas'}</p>
                </div>
                <div className="plant-actions">
                  <div className="btn-group">
                    <button className="edit plant-btn" onClick={() => { setEditPlantIndex(index); setIsEditFormVisible(true); }}><i className="fas fa-edit"></i></button>
                    <button className="add-update plant-btn" onClick={() => addUpdate(index)}><i className="fas fa-plus"></i></button>
                    <button className={`stats ${userData.level >= 10 ? 'expert plant-btn' : 'locked plant-btn'}`} onClick={() => setActiveSection('stats')}><i className="fas fa-chart-bar"></i></button>
                    <button className="delete plant-btn" onClick={() => deletePlant(index)}><i className="fas fa-trash"></i></button>
                  </div>
                  {plant.photo && <img src={plant.photo} alt={plant.name} onClick={() => window.showImage(plant.photo)} />}
                </div>
              </div>
              {plant.updates && plant.updates.length > 0 && (
                <div className="updates">
                  <h3><i className="fas fa-history"></i> Cronología</h3>
                  {plant.updates.map((update, updateIndex) => (
                    <div className="update-card" key={updateIndex}>
                      <div className="update-info">
                        <p className="phase">{update.phase ? `(${update.phase})` : ''}</p>
                        <p>{update.notes || ''} {update.temperature ? `${update.temperature}°C` : ''} {update.humidity ? `${update.humidity}%` : ''}</p>
                        <p className="date">{update.date}</p>
                      </div>
                      <div className="update-actions">
                        {update.photo && <img src={update.photo} alt="Actualización" onClick={() => window.showImage(update.photo)} />}
                        <div className="btn-group">
                          <button className="edit plant-btn" onClick={() => { setUpdatePlantIndex(index); setEditUpdateIndex(updateIndex); setIsUpdateFormVisible(true); }}><i className="fas fa-edit"></i></button>
                          <button className="delete plant-btn" onClick={() => deleteUpdate(index, updateIndex)}><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </>
  );
}
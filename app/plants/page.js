"use client";

import { useState } from 'react';
import { resizeImage } from '../lib/navigation';

export default function Plants({ plants, setPlants, userData, setUserData, setActiveSection, queueNotification }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [editPlantIndex, setEditPlantIndex] = useState(null);
  const [currentEditPlant, setCurrentEditPlant] = useState(null);
  const [newPlant, setNewPlant] = useState({
    name: '',
    startDate: '',
    type: '',
    phase: '',
    temperature: '',
    humidity: '',
    notes: '',
    photo: null,
    updates: [],
  });
  const [updatePlantIndex, setUpdatePlantIndex] = useState(null);
  const [editUpdateIndex, setEditUpdateIndex] = useState(null);
  const [currentUpdate, setCurrentUpdate] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant(prev => ({ ...prev, [name]: value }));
    if (currentEditPlant) {
      setCurrentEditPlant(prev => ({ ...prev, [name]: value }));
    }
    if (currentUpdate) {
      setCurrentUpdate(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e, isNewPlant = true) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 300, 300).then((resizedData) => {
        if (isNewPlant) {
          setNewPlant(prev => ({ ...prev, photo: resizedData }));
        } else if (currentEditPlant) {
          setCurrentEditPlant(prev => ({ ...prev, photo: resizedData }));
        } else if (currentUpdate) {
          setCurrentUpdate(prev => ({ ...prev, photo: resizedData }));
        }
      });
    }
  };

  const savePlant = (e) => {
    e.preventDefault();
    const userPlants = plants.filter(p => !p.notes.includes("Ejemplo inicial"));
    if (userPlants.length >= 5) {
      alert('Límite temporal de 5 plantas alcanzado.');
      return;
    }
    setPlants(prev => [...prev, newPlant]);
    updateUserData('addPlant');
    setNewPlant({
      name: '',
      startDate: '',
      type: '',
      phase: '',
      temperature: '',
      humidity: '',
      notes: '',
      photo: null,
      updates: [],
    });
    setIsFormVisible(false);
  };

  const handleEditPlant = (index) => {
    setEditPlantIndex(index);
    setCurrentEditPlant({ ...plants[index] });
    setIsEditFormVisible(true);
  };

  const saveEditPlant = (e) => {
    e.preventDefault();
    const updatedPlants = [...plants];
    const oldPhase = updatedPlants[editPlantIndex].phase;
    updatedPlants[editPlantIndex] = currentEditPlant;
    setPlants(updatedPlants);
    if (oldPhase !== currentEditPlant.phase) updateUserData('editPlant');
    setIsEditFormVisible(false);
    setEditPlantIndex(null);
    setCurrentEditPlant(null);
  };

  const deletePlant = (index) => {
    setPlants(prev => prev.filter((_, i) => i !== index));
    updateUserData('deletePlant');
  };

  const updateAchievements = (currentAchievements, action) => {
    let updatedAchievements = [...currentAchievements];
    if (action === 'addPlant' && !updatedAchievements.includes('novato')) {
      updatedAchievements.push('novato');
      queueNotification('achievement', 'Cultivador Novato', 'fas fa-seedling', 'novato', '#CD7F32');
    }
    return updatedAchievements;
  };

  const addUpdate = (index) => {
    setIsUpdateFormVisible(true);
    setUpdatePlantIndex(index);
    setEditUpdateIndex(null);
    setCurrentUpdate({
      date: new Date().toISOString().split('T')[0],
      phase: plants[index].phase || '',
      temperature: plants[index].temperature || '',
      humidity: plants[index].humidity || '',
      notes: '',
      photo: null,
    });
  };

  const saveUpdate = (e) => {
    e.preventDefault();
    const update = {
      date: document.getElementById('updateDate').value,
      phase: document.getElementById('updatePhase').value,
      temperature: document.getElementById('updateTemperature').value || null,
      humidity: document.getElementById('updateHumidity').value || null,
      notes: document.getElementById('updateNotes').value,
      photo: null,
    };
    const file = document.getElementById('updatePhoto').files[0];
    if (file) {
      resizeImage(file, 300, 300).then((resizedData) => {
        update.photo = resizedData;
        const updatedPlants = [...plants];
        const plant = updatedPlants.filter(p => !p.notes.includes("Ejemplo inicial"))[updatePlantIndex];
        if (!plant.updates) plant.updates = [];
        plant.updates.push(update);
        setPlants(updatedPlants);
        updateUserData('addUpdate');
        setIsUpdateFormVisible(false);
      });
    } else {
      const updatedPlants = [...plants];
      const plant = updatedPlants.filter(p => !p.notes.includes("Ejemplo inicial"))[updatePlantIndex];
      if (!plant.updates) plant.updates = [];
      plant.updates.push(update);
      setPlants(updatedPlants);
      updateUserData('addUpdate');
      setIsUpdateFormVisible(false);
    }
  };

  const handleEditUpdate = (plantIndex, updateIndex) => {
    setIsUpdateFormVisible(true);
    setUpdatePlantIndex(plantIndex);
    setEditUpdateIndex(updateIndex);
    const plant = plants.filter(p => !p.notes.includes("Ejemplo inicial"))[plantIndex];
    const update = plant.updates[updateIndex];
    setCurrentUpdate({ ...update });
  };

  const saveEditUpdate = (e) => {
    e.preventDefault();
    const updatedUpdate = {
      date: document.getElementById('updateDate').value,
      phase: document.getElementById('updatePhase').value,
      temperature: document.getElementById('updateTemperature').value || null,
      humidity: document.getElementById('updateHumidity').value || null,
      notes: document.getElementById('updateNotes').value,
      photo: currentUpdate?.photo || null,
    };
    const file = document.getElementById('updatePhoto').files[0];
    if (file) {
      resizeImage(file, 300, 300).then((resizedData) => {
        updatedUpdate.photo = resizedData;
        const updatedPlants = [...plants];
        const plant = updatedPlants.filter(p => !p.notes.includes("Ejemplo inicial"))[updatePlantIndex];
        plant.updates[editUpdateIndex] = updatedUpdate;
        setPlants(updatedPlants);
        setIsUpdateFormVisible(false);
        setCurrentUpdate(null);
      });
    } else {
      const updatedPlants = [...plants];
      const plant = updatedPlants.filter(p => !p.notes.includes("Ejemplo inicial"))[updatePlantIndex];
      plant.updates[editUpdateIndex] = updatedUpdate;
      setPlants(updatedPlants);
      setIsUpdateFormVisible(false);
      setCurrentUpdate(null);
    }
  };

  const deleteUpdate = (plantIndex, updateIndex) => {
    const updatedPlants = [...plants];
    const plant = updatedPlants.filter(p => !p.notes.includes("Ejemplo inicial"))[plantIndex];
    plant.updates.splice(updateIndex, 1);
    setPlants(updatedPlants);
    updateUserData('deleteUpdate');
  };

  const updateUserData = (action) => {
    let totalUpdates = 0;
    let uniqueUpdatedPlants = new Set();
    let deleteCount = userData.missionProgress.deleteCount || 0;
    let phaseChangeCount = userData.missionProgress.phaseChangeCount || 0;

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
      const updatedAchievements = prev.achievements;
      const missionProgress = { ...prev.missionProgress };

      if (action === 'addPlant') missionProgress.addFirstPlant = Math.min((missionProgress.addFirstPlant || 0) + 1, 1);
      if (action === 'addUpdate') missionProgress.addFirstUpdate = Math.min((missionProgress.addFirstUpdate || 0) + 1, 1);
      if (action === 'editPlant') missionProgress.changePhase = Math.min((missionProgress.changePhase || 0) + 1, 1);
      if (action === 'deletePlant' || action === 'deleteUpdate') missionProgress.deleteCount = (missionProgress.deleteCount || 0) + 1;
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

      // Notificaciones de misiones
      if (action === 'addPlant' && missionProgress.addFirstPlant === 1) queueNotification('mission', 'Agrega tu primera planta');
      if (action === 'addUpdate' && missionProgress.addFirstUpdate === 1) queueNotification('mission', 'Agrega tu primera actualización');
      if (action === 'editPlant' && missionProgress.changePhase === 1) queueNotification('mission', 'Cambia la fase de una planta');
      if (action === 'deletePlant' && missionProgress.deleteCount === 1) queueNotification('mission', 'Elimina una planta');
      if (missionProgress.plant30Days === 30) queueNotification('mission', 'Mantén una planta activa 30 días');
      if (missionProgress.plant90Days === 90) queueNotification('mission', 'Mantén una planta activa 90 días');
      if (missionProgress.plant180Days === 180) queueNotification('mission', 'Mantén una planta activa 180 días');
      if (action === 'addPlant' && missionProgress.addFivePlants === 5) queueNotification('mission', 'Agrega 5 plantas');
      if (action === 'addUpdate' && missionProgress.updateFivePlants === 5) queueNotification('mission', 'Actualiza 5 plantas');
      if (action === 'editPlant' && missionProgress.fivePhases === 5) queueNotification('mission', 'Usa 5 fases distintas o repetidas');
      if (missionProgress.deleteFive === 5) queueNotification('mission', 'Elimina 5 plantas o actualizaciones');
      if (action === 'addPlant' && missionProgress.addTenPlants === 10) queueNotification('mission', 'Agrega 10 plantas');
      if (action === 'addUpdate' && missionProgress.updateTenPlants === 10) queueNotification('mission', 'Actualiza 10 plantas');
      if (action === 'editPlant' && missionProgress.tenPhases === 10) queueNotification('mission', 'Usa 10 fases distintas o repetidas');
      if (missionProgress.deleteTen === 10) queueNotification('mission', 'Elimina 10 plantas o actualizaciones');

      return { ...prev, achievements: updatedAchievements, missionProgress };
    });
  };

  return (
    <>
      <button
        onClick={() => setIsFormVisible(true)}
        id="addPlantBtn"
        className={isFormVisible || isEditFormVisible || isUpdateFormVisible ? 'hidden' : 'fixed bottom-80 right-20 w-50 h-50 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 flex items-center justify-center dark:bg-green-600 dark:hover:bg-green-700 plant-btn'}
      >
        <i className="fas fa-leaf" style={{ fontSize: '24px' }}></i>
      </button>
      {isFormVisible && (
        <form id="plantForm" className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50" onSubmit={savePlant}>
          <div className="bg-white p-12 rounded-md shadow-md w-11/12 max-w-md md:max-w-lg dark:bg-gray-900 plant-form">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-8 flex items-center">
              <i className="fas fa-leaf mr-3"></i> Agregar Nueva Planta
            </h2>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Nombre:</label>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                required
                value={newPlant.name}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Fecha de Inicio:</label>
              <input
                type="date"
                name="startDate"
                required
                value={newPlant.startDate}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Tipo de Planta:</label>
              <select
                name="type"
                required
                value={newPlant.type}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="">Tipo de planta</option>
                <option value="indica">Indica</option>
                <option value="sativa">Sativa</option>
                <option value="hybrid">Híbrida</option>
                <option value="otra">Otra</option>
              </select>
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Fase Actual:</label>
              <select
                name="phase"
                required
                value={newPlant.phase}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="">Fase actual</option>
                <option value="semilla">Semilla</option>
                <option value="vegetativa">Vegetativa</option>
                <option value="floracion">Floración</option>
              </select>
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Temperatura (°C):</label>
              <input
                type="number"
                name="temperature"
                placeholder="Temperatura (°C)"
                step="0.1"
                min="0"
                max="50"
                value={newPlant.temperature}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Humedad (%):</label>
              <input
                type="number"
                name="humidity"
                placeholder="Humedad (%)"
                step="1"
                min="0"
                max="100"
                value={newPlant.humidity}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Foto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e, true)}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Notas:</label>
              <textarea
                name="notes"
                placeholder="Notas"
                value={newPlant.notes}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 h-20 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              ></textarea>
            </div>
            <div className="flex justify-between mt-8">
              <button type="submit" className="bg-green-500 text-white p-10 rounded-md hover:bg-green-600 flex items-center gap-5 mr-4 dark:bg-green-600 dark:hover:bg-green-700 plant-btn">
                <i className="fas fa-plus"></i> Agregar Planta
              </button>
              <button type="button" onClick={() => setIsFormVisible(false)} className="bg-red-500 text-white p-10 rounded-md hover:bg-red-600 flex items-center gap-5 dark:bg-red-600 dark:hover:bg-red-700 plant-btn">
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </div>
        </form>
      )}
      {isEditFormVisible && currentEditPlant && (
        <form id="editPlantForm" className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50" onSubmit={saveEditPlant}>
          <div className="bg-white p-12 rounded-md shadow-md w-11/12 max-w-md md:max-w-lg dark:bg-gray-900 plant-form">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-8 flex items-center">
              <i className="fas fa-edit mr-3"></i> Editar Planta
            </h2>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Nombre:</label>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                required
                value={currentEditPlant.name}
                onChange={(e) => setCurrentEditPlant(prev => ({ ...prev, name: e.target.value }))}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Fecha de Inicio:</label>
              <input
                type="date"
                name="startDate"
                required
                value={currentEditPlant.startDate}
                onChange={(e) => setCurrentEditPlant(prev => ({ ...prev, startDate: e.target.value }))}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Tipo de Planta:</label>
              <select
                name="type"
                required
                value={currentEditPlant.type}
                onChange={(e) => setCurrentEditPlant(prev => ({ ...prev, type: e.target.value }))}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="">Tipo de planta</option>
                <option value="indica">Indica</option>
                <option value="sativa">Sativa</option>
                <option value="hybrid">Híbrida</option>
                <option value="otra">Otra</option>
              </select>
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Fase Actual:</label>
              <select
                name="phase"
                required
                value={currentEditPlant.phase || ''}
                onChange={(e) => setCurrentEditPlant(prev => ({ ...prev, phase: e.target.value }))}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="">Fase actual</option>
                <option value="semilla">Semilla</option>
                <option value="vegetativa">Vegetativa</option>
                <option value="floracion">Floración</option>
              </select>
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Temperatura (°C):</label>
              <input
                type="number"
                name="temperature"
                placeholder="Temperatura (°C)"
                step="0.1"
                min="0"
                max="50"
                value={currentEditPlant.temperature || ''}
                onChange={(e) => setCurrentEditPlant(prev => ({ ...prev, temperature: e.target.value }))}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Humedad (%):</label>
              <input
                type="number"
                name="humidity"
                placeholder="Humedad (%)"
                step="1"
                min="0"
                max="100"
                value={currentEditPlant.humidity || ''}
                onChange={(e) => setCurrentEditPlant(prev => ({ ...prev, humidity: e.target.value }))}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Foto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e, false)}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Notas:</label>
              <textarea
                name="notes"
                placeholder="Notas"
                value={currentEditPlant.notes || ''}
                onChange={(e) => setCurrentEditPlant(prev => ({ ...prev, notes: e.target.value }))}
                className="p-8 border border-green-300 rounded-md w-2/3 h-20 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              ></textarea>
            </div>
            <div className="flex justify-between mt-8">
              <button type="submit" className="bg-green-500 text-white p-10 rounded-md hover:bg-green-600 flex items-center gap-5 mr-4 dark:bg-green-600 dark:hover:bg-green-700 plant-btn">
                <i className="fas fa-save"></i> Editar Planta
              </button>
              <button type="button" onClick={() => setIsEditFormVisible(false)} className="bg-red-500 text-white p-10 rounded-md hover:bg-red-600 flex items-center gap-5 dark:bg-red-600 dark:hover:bg-red-700 plant-btn">
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </div>
        </form>
      )}
      {isUpdateFormVisible && (
        <form id="updateForm" className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50" onSubmit={(e) => editUpdateIndex !== null ? saveEditUpdate(e) : saveUpdate(e)}>
          <div className="bg-white p-12 rounded-md shadow-md w-11/12 max-w-md md:max-w-lg dark:bg-gray-900 plant-form">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-8 flex items-center">
              <i className={`${editUpdateIndex !== null ? 'fas fa-edit' : 'fas fa-plus'} mr-3`}></i> {editUpdateIndex !== null ? 'Editar Actualización' : 'Agregar Actualización'}
            </h2>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Fecha:</label>
              <input
                type="date"
                id="updateDate"
                name="date"
                required
                value={currentUpdate?.date || ''}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Fase:</label>
              <select
                id="updatePhase"
                name="phase"
                required
                value={currentUpdate?.phase || ''}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="">Fase actual</option>
                <option value="semilla">Semilla</option>
                <option value="vegetativa">Vegetativa</option>
                <option value="floracion">Floración</option>
              </select>
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Temperatura (°C):</label>
              <input
                type="number"
                id="updateTemperature"
                name="temperature"
                placeholder="Temperatura (°C)"
                step="0.1"
                min="0"
                max="50"
                value={currentUpdate?.temperature || ''}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Humedad (%):</label>
              <input
                type="number"
                id="updateHumidity"
                name="humidity"
                placeholder="Humedad (%)"
                step="1"
                min="0"
                max="100"
                value={currentUpdate?.humidity || ''}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Notas:</label>
              <textarea
                id="updateNotes"
                name="notes"
                placeholder="Notas"
                value={currentUpdate?.notes || ''}
                onChange={handleInputChange}
                className="p-8 border border-green-300 rounded-md w-2/3 h-20 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              ></textarea>
            </div>
            <div className="flex items-center mb-6">
              <label className="text-green-700 dark:text-green-300 mr-4 w-1/3">Foto:</label>
              <input
                type="file"
                id="updatePhoto"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e, false)}
                className="p-8 border border-green-300 rounded-md w-2/3 dark:border-green-500 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            <div className="flex justify-between mt-8">
              <button type="submit" className="bg-green-500 text-white p-10 rounded-md hover:bg-green-600 flex items-center gap-5 mr-4 dark:bg-green-600 dark:hover:bg-green-700 plant-btn">
                {editUpdateIndex !== null ? <><i className="fas fa-save"></i> Editar Actualización</> : <><i className="fas fa-plus"></i> Agregar Actualización</>}
              </button>
              <button type="button" onClick={() => setIsUpdateFormVisible(false)} className="bg-red-500 text-white p-10 rounded-md hover:bg-red-600 flex items-center gap-5 dark:bg-red-600 dark:hover:bg-red-700 plant-btn">
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </div>
        </form>
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
                    <button className="edit plant-btn" onClick={() => handleEditPlant(index)}><i className="fas fa-edit"></i></button>
                    <button className="add-update plant-btn" onClick={() => addUpdate(index)}><i className="fas fa-plus"></i></button>
                    <button className={`stats ${userData.achievements.includes("experto") ? 'expert plant-btn' : 'locked plant-btn'}`} onClick={() => setActiveSection('stats')}><i className="fas fa-chart-bar"></i></button>
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
                          <button className="edit plant-btn" onClick={() => handleEditUpdate(index, updateIndex)}><i className="fas fa-edit"></i></button>
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
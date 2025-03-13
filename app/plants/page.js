"use client";

import { useState } from 'react';
import PlantForm from '../components/plants/PlantForm'
import UpdateForm from '../components/plants/UpdateForm';
import PlantList from '../components/plants/PlantList';
import PlantDetail from '../components/plants/PlantDetail';

export default function Plants({ plants, setPlants, userData, setUserData, setActiveSection, queueNotification, selectedPlant, setSelectedPlant }) {
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
    setSelectedPlant(null); // Regresar a vista general si se borra la planta seleccionada
  };

  const addUpdate = (index) => {
    setIsUpdateFormVisible(true);
    setUpdatePlantIndex(index);
    setEditUpdateIndex(null);
    const plant = plants[index];
    initialUpdateData.phase = plant.phase || '';
    initialUpdateData.temperature = '';
    initialUpdateData.humidity = '';
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

  // Función para determinar la fase actual
  const getCurrentPhase = (plant) => {
    if (plant.updates && plant.updates.length > 0) {
      const latestPhase = plant.updates.reduce((prev, curr) => {
        if (curr.phase === 'floracion') return 'floracion';
        if (curr.phase === 'vegetativa' && prev !== 'floracion') return 'vegetativa';
        return prev || curr.phase;
      }, null);
      return latestPhase || plant.phase || 'semilla';
    }
    return plant.phase || 'semilla';
  };

  // Vista detallada de la planta
  if (selectedPlant !== null) {
    return (
      <PlantDetail 
        plant={plants[selectedPlant]}
        selectedPlant={selectedPlant}
        userData={userData}
        getCurrentPhase={getCurrentPhase}
        setActiveSection={setActiveSection}
        setEditPlantIndex={setEditPlantIndex}
        setIsEditFormVisible={setIsEditFormVisible}
        deletePlant={deletePlant}
        addUpdate={addUpdate}
        deleteUpdate={deleteUpdate}
        setUpdatePlantIndex={setUpdatePlantIndex}
        setEditUpdateIndex={setEditUpdateIndex}
        setIsUpdateFormVisible={setIsUpdateFormVisible}
        isEditFormVisible={isEditFormVisible}
        plants={plants}
        editPlantIndex={editPlantIndex}
        saveEditPlant={saveEditPlant}
        isUpdateFormVisible={isUpdateFormVisible}
        updatePlantIndex={updatePlantIndex}
        editUpdateIndex={editUpdateIndex}
        initialUpdateData={initialUpdateData}
        saveUpdate={saveUpdate}
        setSelectedPlant={setSelectedPlant} // Pasamos setSelectedPlant
      />
    );
  }

  // Vista general de plantas
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
      
      <PlantList 
        plants={plants}
        isFormVisible={isFormVisible}
        isEditFormVisible={isEditFormVisible}
        isUpdateFormVisible={isUpdateFormVisible}
        setSelectedPlant={setSelectedPlant}
        setEditPlantIndex={setEditPlantIndex}
        setIsEditFormVisible={setIsEditFormVisible}
        deletePlant={deletePlant}
        getCurrentPhase={getCurrentPhase}
      />
      
      {isEditFormVisible && (
        <PlantForm
          onSubmit={saveEditPlant}
          onCancel={() => setIsEditFormVisible(false)}
          initialData={plants[editPlantIndex]}
          title="Editar Planta"
          icon="fas fa-edit"
        />
      )}
    </>
  );
}
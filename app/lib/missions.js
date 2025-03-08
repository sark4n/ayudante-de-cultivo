import clientPromise from './mongodb';

export async function initializeAchievements() {
  const client = await clientPromise;
  const db = client.db("miCultivo");
  const count = await db.collection("achievements").countDocuments();
  if (count === 0) {
    const defaultAchievements = [
      { 
        id: "novato", 
        name: "Cultivador Novato", 
        color: "#CD7F32", 
        icon: "fas fa-seedling",
        missions: [
          { id: "addFirstPlant", name: "Agrega tu primera planta", target: 1, icon: "fas fa-plus-circle" },
          { id: "addFirstUpdate", name: "Agrega tu primera actualización", target: 1, icon: "fas fa-sync-alt" },
          { id: "changePhase", name: "Cambia la fase de una planta", target: 1, icon: "fas fa-exchange-alt" },
          { id: "deletePlant", name: "Elimina una planta", target: 1, icon: "fas fa-trash-alt" },
          { id: "plant30Days", name: "Mantén una planta activa 30 días", target: 30, icon: "fas fa-calendar-check" }
        ]
      },
      { 
        id: "avanzado", 
        name: "Cultivador Avanzado", 
        color: "#C0C0C0", 
        icon: "fas fa-medal",
        missions: [
          { id: "addFivePlants", name: "Agrega 5 plantas", target: 5, icon: "fas fa-layer-group" },
          { id: "updateFivePlants", name: "Actualiza 5 plantas", target: 5, icon: "fas fa-sync-alt" },
          { id: "fivePhases", name: "Usa 5 fases distintas o repetidas", target: 5, icon: "fas fa-exchange-alt" },
          { id: "deleteFive", name: "Elimina 5 plantas o actualizaciones", target: 5, icon: "fas fa-trash-alt" },
          { id: "plant90Days", name: "Mantén una planta activa 90 días", target: 90, icon: "fas fa-calendar-check" }
        ]
      },
      { 
        id: "experto", 
        name: "Cultivador Experto", 
        color: "#FFD700", 
        icon: "fas fa-crown",
        missions: [
          { id: "addTenPlants", name: "Agrega 10 plantas", target: 10, icon: "fas fa-th-large" },
          { id: "updateTenPlants", name: "Actualiza 10 plantas", target: 10, icon: "fas fa-sync-alt" },
          { id: "tenPhases", name: "Usa 10 fases distintas o repetidas", target: 10, icon: "fas fa-exchange-alt" },
          { id: "deleteTen", name: "Elimina 10 plantas o actualizaciones", target: 10, icon: "fas fa-trash-alt" },
          { id: "plant180Days", name: "Mantén una planta activa 180 días", target: 180, icon: "fas fa-calendar-check" }
        ]
      }
    ];
    await db.collection("achievements").insertMany(defaultAchievements);
    console.log("Logros iniciales insertados en la base de datos.");
  }
}
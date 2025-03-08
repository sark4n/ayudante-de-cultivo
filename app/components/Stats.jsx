"use client";

export default function Stats({ plants, userData, setActiveSection }) {
  const isExpert = userData.achievements.includes("experto");

  if (!isExpert) {
    return (
      <ul className="stats-report">
        <li className="empty-card">
          <i className="fas fa-lock"></i>
          <p>¡Esta función está bloqueada!</p>
          <p>
            Tip del cultivador: Necesitas ser cultivador Experto para desbloquear esta función. ¡Sigue cultivando para conseguir más logros!
          </p>
        </li>
      </ul>
    );
  }

  return (
    <ul className="stats-report">
      {plants
        .filter((p) => !p.notes.includes("Ejemplo inicial"))
        .slice(0, 5)
        .map((plant, index) => {
          const startDate = new Date(plant.startDate);
          const today = new Date();
          const daysAlive = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
          let phaseDays = { semilla: 0, vegetativa: 0, floracion: 0 };
          let lastDate = startDate;
          let lastPhase = plant.phase || "semilla";
          if (plant.updates && plant.updates.length > 0) {
            plant.updates.forEach((update) => {
              const updateDate = new Date(update.date);
              const daysInPhase = Math.floor((updateDate - lastDate) / (1000 * 60 * 60 * 24));
              phaseDays[lastPhase] += daysInPhase;
              lastDate = updateDate;
              lastPhase = update.phase || lastPhase;
            });
          }
          const daysSinceLastUpdate = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
          phaseDays[lastPhase] += daysSinceLastUpdate;

          let totalTemp = plant.temperature ? parseFloat(plant.temperature) : 0;
          let tempCount = plant.temperature ? 1 : 0;
          let totalHumidity = plant.humidity ? parseFloat(plant.humidity) : 0;
          let humidityCount = plant.humidity ? 1 : 0;
          if (plant.updates) {
            plant.updates.forEach((update) => {
              if (update.temperature) {
                totalTemp += parseFloat(update.temperature);
                tempCount++;
              }
              if (update.humidity) {
                totalHumidity += parseFloat(update.humidity);
                humidityCount++;
              }
            });
          }
          const avgTemp = tempCount > 0 ? (totalTemp / tempCount).toFixed(1) : "N/A";
          const avgHumidity = humidityCount > 0 ? (totalHumidity / humidityCount).toFixed(1) : "N/A";

          return (
            <li key={index} className="stats-report">
              <div className="stats-card">
                <h3 className="plant-title">
                  <i className="fas fa-leaf plant-icon"></i> {plant.name}
                </h3>
                <p>
                  <strong>Tipo:</strong> {plant.type}
                </p>
                <p>
                  <strong>Días viva:</strong> {daysAlive} días
                </p>
                <h4>Condiciones promedio</h4>
                <p>
                  <i className="fas fa-thermometer-half"></i> <strong>Temperatura:</strong> {avgTemp}°C
                </p>
                <p>
                  <i className="fas fa-tint"></i> <strong>Humedad:</strong> {avgHumidity}%
                </p>
                <h4>Días por etapa</h4>
                <div className="phase-bar">
                  <div className="bar semilla" style={{ width: `${phaseDays.semilla}px` }}></div>
                  <span>Semilla: {phaseDays.semilla} días</span>
                </div>
                <div className="phase-bar">
                  <div className="bar vegetativa" style={{ width: `${phaseDays.vegetativa}px` }}></div>
                  <span>Vegetativa: {phaseDays.vegetativa} días</span>
                </div>
                <div className="phase-bar">
                  <div className="bar floracion" style={{ width: `${phaseDays.floracion}px` }}></div>
                  <span>Floración: {phaseDays.floracion} días</span>
                </div>
                <div className="locked">
                  <h4>Predicción de cosecha</h4>
                  <p className="locked-premium">
                    <i className="fas fa-lock"></i> Desbloquea con Premium
                  </p>
                  <button className="premium-btn" onClick={() => setActiveSection("premium")}>
                    <i className="fas fa-star"></i> Obtener Premium
                  </button>
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  );
}
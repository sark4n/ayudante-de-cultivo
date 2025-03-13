export default function Footer({ activeSection, handleSectionChange, userData, pendingMissionsCount }) {
  const totalMissionsPending = pendingMissionsCount; // Usamos el valor directamente, no lo invocamos
  console.log("Footer - totalMissionsPending:", totalMissionsPending);

  return (
    <footer className="footer">
      <nav>
        {[
          { id: "home", icon: "fa-home", label: "Inicio" },
          { id: "missions", icon: "fa-trophy", label: "Misiones" },
          { id: "community", icon: "fa-users", label: "Comunidad" },
          { id: "plants", icon: "fa-leaf", label: "Plantas" },
          { id: "profile", icon: "fa-user", label: "Perfil" },
        ].map(({ id, icon, label }) => (
          <button
            key={id}
            className={`tab-btn ${activeSection === id ? "active" : ""}`}
            data-tab={id}
            onClick={() => handleSectionChange(id)}
          >
            {id === "profile" && userData.profilePhoto ? (
              <img src={userData.profilePhoto} alt="Perfil" className="profile-img" />
            ) : (
              <i className={`fas ${icon}`}></i>
            )}
            <span>{label}</span>
            {id === "missions" && totalMissionsPending > 0 && (
              <span className="notification-dot" style={{ color: "white" }}>
                {totalMissionsPending}
              </span>
            )}
            {id === "profile" && (userData.newAchievements || 0) > 0 && (
              <span className="notification-dot" style={{ color: "white" }}>
                {userData.newAchievements}
              </span>
            )}
          </button>
        ))}
      </nav>
    </footer>
  );
}
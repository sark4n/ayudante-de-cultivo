"use client";

export default function Footer({ activeSection, handleSectionChange, userData, pendingMissionsCount }) {
  return (
    <footer className="footer">
      <nav>
        {[
          { id: "home", icon: "fa-home", label: "Inicio" },
          { id: "plants", icon: "fa-leaf", label: "Plantas" },
          { id: "guides", icon: "fa-book", label: "Guías" },
          { id: "community", icon: "fa-users", label: "Comunidad" },
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
            {id === "profile" && pendingMissionsCount > 0 && (
              <span className="notification-dot" style={{ color: "white" }} >{pendingMissionsCount}</span>
            )}
          </button>
        ))}
      </nav>
    </footer>
  );
}
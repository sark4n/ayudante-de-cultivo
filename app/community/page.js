"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Community({ queueNotification, setActiveSection }) {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/community/users', { cache: 'no-store' });
      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Datos inválidos: no es un arreglo');
      console.log('Usuarios obtenidos:', data);
      setUsers(data);
      const online = data.filter(user => user.isOnline);
      console.log('Usuarios en línea:', online);
      setOnlineUsers(online);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      queueNotification('warning', 'Error al cargar la comunidad', 'fas fa-exclamation-triangle');
      setUsers([]);
      setOnlineUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [queueNotification, session]);

  useEffect(() => {
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [session]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = async (userId) => {
    console.log('Clic en usuario:', userId);
    if (status === 'authenticated' && session?.user?.id === userId) {
      setActiveSection('profile');
      // window.history.pushState({}, '', '/profile');
    } else {
      try {
        const response = await fetch(`/api/user/get?userId=${userId}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error al cargar el usuario');
        const userData = await response.json();
        console.log('Usuario seleccionado:', userData);
        setSelectedUser(userData);
        setIsUserCardOpen(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        queueNotification('warning', 'No se pudo cargar el perfil del usuario', 'fas fa-exclamation-triangle');
      }
    }
  };

  const closeUserCard = () => {
    setIsUserCardOpen(false);
    setSelectedUser(null);
  };

  if (status === 'loading' || loading) {
    return <div className="text-center p-20 text-green-700 dark:text-green-300">Cargando...</div>;
  }

  return (
    <section id="community" className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300">
        <i className="fas fa-users mr-2"></i> Comunidad
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">
          <i className="fas fa-signal mr-2"></i> Usuarios en Línea ({onlineUsers.length})
        </h3>
        {onlineUsers.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No hay usuarios en línea ahora.</p>
        ) : (
          <div className="online-users-grid">
            {onlineUsers.map(user => (
              <div
                key={user.id}
                className="online-user"
                onClick={() => handleUserClick(user.id)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="online-user-photo"
                  style={{ backgroundImage: `url(${user.profilePhoto || '/default-profile.jpg'})` }}
                  title={user.name}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {isUserCardOpen && selectedUser && (
        <div className="uc-overlay" onClick={closeUserCard}>
          <div className="uc-container" onClick={e => e.stopPropagation()}>
            <button className="uc-close-btn" onClick={closeUserCard}>
              <i className="fas fa-times"></i>
            </button>
            <div className="uc-header">
              <div
                className="uc-profile-pic"
                style={{ backgroundImage: `url(${selectedUser.profilePhoto || '/default-profile.jpg'})` }}
              />
              <div className="uc-details">
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.bio || 'Sin biografía'}</p>
                <button className="uc-message-btn" disabled>
                  <i className="fas fa-envelope"></i> Mensaje (próximamente)
                </button>
              </div>
            </div>
            <div className="uc-content">
              <h4>Logros</h4>
              <div className="uc-achievements-grid">
                {selectedUser.achievements && selectedUser.achievements.length > 0 ? (
                  <p>Cargando logros...</p> // Pendiente de integrar /api/achievements
                ) : (
                  <p>No hay logros obtenidos.</p>
                )}
              </div>
              <h4>Galería Pública</h4>
              <div className="uc-plants-grid">
                {selectedUser.plants && selectedUser.plants.filter(plant => plant.isPublic).length > 0 ? (
                  selectedUser.plants.filter(plant => plant.isPublic).map(plant => (
                    <div key={plant.id} className="uc-plant-item">
                      <div
                        className="uc-plant-image"
                        style={{ backgroundImage: `url(${plant.photo || '/default-plant.jpg'})` }}
                      />
                      <div className="uc-plant-details">
                        <h5>{plant.name}</h5>
                        <p>Fase: {plant.phase || 'Desconocida'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay plantas públicas.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Galería Pública</h3>
        {users.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No hay usuarios disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUsers.map(user => (
              user.plants.filter(plant => plant.isPublic).map(plant => (
                <div key={plant.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${plant.photo || '/default-plant.jpg'})` }}
                  />
                  <div className="p-4 flex items-center">
                    <Link href="#" onClick={() => handleUserClick(user.id)}>
                      <div
                        className="w-12 h-12 rounded-full bg-cover bg-center cursor-pointer mr-3"
                        style={{ backgroundImage: `url(${user.profilePhoto || '/default-profile.jpg'})` }}
                      />
                    </Link>
                    <div>
                      <p className="font-semibold">{plant.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Por: {user.name}</p>
                    </div>
                  </div>
                </div>
              ))
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Actividad Reciente</h3>
        {users.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No hay actividad reciente.</p>
        ) : (
          <div className="space-y-4">
            {filteredUsers
              .map(user =>
                user.plants
                  .filter(plant => plant.isPublic)
                  .map(plant => ({ userId: user.id, plant }))
              )
              .flat()
              .sort((a, b) => new Date(b.plant.updatedAt || b.plant.startDate) - new Date(a.plant.updatedAt || a.plant.startDate))
              .slice(0, 5)
              .map(({ userId, plant }) => (
                <div
                  key={`${userId}-${plant.id}`}
                  className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <div
                    className="w-16 h-16 rounded bg-cover bg-center mr-3"
                    style={{ backgroundImage: `url(${plant.photo || '/default-plant.jpg'})` }}
                  />
                  <div>
                    <p className="font-semibold">{plant.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Actualizado el {new Date(plant.updatedAt || plant.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Community({ queueNotification, setActiveSection }) {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar datos de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/community/users');
        if (!response.ok) throw new Error('Error al cargar usuarios');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Datos inválidos: no es un arreglo');
        setUsers(data);
        setOnlineUsers(data.filter(user => user.isOnline));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        queueNotification('warning', 'Error al cargar la comunidad', 'fas fa-exclamation-triangle');
        setUsers([]);
        setOnlineUsers([]);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [queueNotification]);

  // Actualización en tiempo real para usuarios en línea
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/community/users');
        if (!response.ok) throw new Error('Error al actualizar usuarios en línea');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Datos inválidos: no es un arreglo');
        setOnlineUsers(data.filter(user => user.isOnline));
      } catch (error) {
        console.error('Error updating online users:', error);
        // No mostramos notificación aquí para no spamear
      }
    }, 10000); // Cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return <div className="text-center p-20 text-green-700 dark:text-green-300">Cargando...</div>;
  }

  return (
    <section id="community" className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300">
        <i className="fas fa-users mr-2"></i> Comunidad
      </h2>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Galería Pública */}
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
                    <Link href={`/profile?userId=${user.id}`} onClick={() => setActiveSection('profile')}>
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

      {/* Usuarios en Línea */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Usuarios en Línea ({onlineUsers.length})</h3>
        {onlineUsers.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No hay usuarios en línea ahora.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {onlineUsers.map(user => (
              <div key={user.id} className="flex items-center p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Link href={`/profile?userId=${user.id}`} onClick={() => setActiveSection('profile')}>
                  <div
                    className="w-10 h-10 rounded-full bg-cover bg-center cursor-pointer mr-2"
                    style={{ backgroundImage: `url(${user.profilePhoto || '/default-profile.jpg'})` }}
                  />
                </Link>
                <span className="text-green-700 dark:text-green-300">{user.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actividad Reciente */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Actividad Reciente</h3>
        {users.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No hay actividad reciente.</p>
        ) : (
          <div className="space-y-4">
            {filteredUsers
              .flatMap(user => user.plants.filter(plant => plant.isPublic))
              .sort((a, b) => new Date(b.updatedAt || b.startDate) - new Date(a.updatedAt || a.startDate))
              .slice(0, 5)
              .map(plant => (
                <div key={plant.id} className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
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
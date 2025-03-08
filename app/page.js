"use client";

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { showTipOfTheDay } from './lib/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import MainContent from './components/MainContent';
import ImageModal from './components/ImageModal';

export default function Home() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState('home');
  const [plants, setPlants] = useState([]);
  const [userData, setUserData] = useState({
    achievements: [],
    missionProgress: {},
    profilePhoto: null,
    name: '',
    email: '',
  });
  const [achievementsData, setAchievementsData] = useState([]);
  const [pendingNotifications, setPendingNotifications] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements');
        const data = await response.json();
        setAchievementsData(data);
      } catch (error) {
        console.error("Error al cargar logros:", error);
      }
    };
    fetchAchievements();
  }, []);

  const pendingMissionsCount = () => {
    let count = 0;
    achievementsData.forEach(ach => {
      if (!userData.achievements.includes(ach.id)) {
        ach.missions.forEach(mission => {
          const progress = userData.missionProgress[mission.id] || 0;
          if (progress >= mission.target && !userData.missionProgress[`${mission.id}_completed`]) {
            count++;
          }
        });
      }
    });
    return count;
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log("Cargando datos de sesión:", session.user);
      setUserData({
        achievements: session.user.achievements || [],
        missionProgress: session.user.missionProgress || {},
        profilePhoto: session.user.profilePhoto || session.user.image || null,
        name: session.user.name || 'Usuario autenticado',
        email: session.user.email,
      });
      setPlants(session.user.plants || []);
      showTipOfTheDay();
    }
  }, [session, status]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const updateData = async () => {
        console.log("Guardando datos en MongoDB:", { userData, plants });
        try {
          const response = await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userData, plants }),
          });
          const result = await response.json();
          if (!response.ok) {
            console.error('Error al actualizar datos:', result);
          } else {
            console.log('Datos actualizados con éxito:', result);
          }
        } catch (error) {
          console.error('Error en useEffect de actualización:', error);
        }
      };
      updateData();
    }
  }, [userData, plants, status, session]);

  useEffect(() => {
    if (pendingNotifications.length > 0) {
      pendingNotifications.forEach(({ type, name, icon, id, color }) => {
        const message = (
          <div className="flex items-center gap-2">
            {icon && <i className={icon} style={{ color: type === 'achievement' ? '#FFFFFF' : '#4caf50' }}></i>}
            <span>{type === 'mission' ? `Misión completada: ${name}` : `Logro desbloqueado: ${name}`}</span>
          </div>
        );
        const toastOptions = {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: document.body.classList.contains('dark') ? 'dark' : 'light',
          icon: false, // Desactivamos el ícono predeterminado
        };
        if (type === 'mission') {
          toast.success(message, toastOptions);
        } else if (type === 'achievement') {
          toast.success(message, {
            ...toastOptions,
            style: { backgroundColor: color, color: '#FFFFFF' },
          });
        }
      });
      setPendingNotifications([]); // Limpiamos después de mostrar
    }
  }, [pendingNotifications]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const queueNotification = (type, name, icon = null, id = null, color = null) => {
    setPendingNotifications(prev => {
      // Evitamos duplicados verificando si ya existe una notificación igual
      if (prev.some(notif => notif.type === type && notif.name === name)) return prev;
      return [...prev, { type, name, icon, id, color }];
    });
  };

  if (status === 'loading') {
    return <div className="text-center p-20 text-green-700 dark:text-green-300">Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Ayudante de Cultivo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2e7d32" />
      </Head>

      <div id="appScreen" className={status === 'authenticated' ? '' : 'hidden'}>
        <Header activeSection={activeSection} />
        <MainContent
          activeSection={activeSection}
          plants={plants}
          setPlants={setPlants}
          userData={userData}
          setUserData={setUserData}
          setActiveSection={handleSectionChange}
          queueNotification={queueNotification}
          setSelectedAchievement={setSelectedAchievement}
          selectedAchievement={selectedAchievement}
        />
        <Footer 
          activeSection={activeSection} 
          handleSectionChange={handleSectionChange} 
          userData={userData} 
          pendingMissionsCount={pendingMissionsCount()}
        />
        <ImageModal />
        <ToastContainer position="bottom-right" />
      </div>

      <LoginScreen status={status} />
    </>
  );
}
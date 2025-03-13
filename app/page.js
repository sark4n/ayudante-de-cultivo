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
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [userData, setUserData] = useState({
    achievements: [],
    missionProgress: {},
    profilePhoto: null,
    name: '',
    email: '',
    level: 0,
    xp: 0,
    newAchievements: 0,
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

  const dailyMissions = [
    { id: "checkPlant", name: "Chequear Planta", xp: 10, target: 1, icon: "fas fa-eye" },
    { id: "waterPlant", name: "Regar Planta", xp: 15, target: 1, icon: "fas fa-tint" },
    { id: "updatePlant", name: "Actualizar Planta", xp: 20, target: 1, icon: "fas fa-sync-alt" },
  ];

  const pendingMissionsCount = () => {
    let count = 0;
    const allMissions = [
      ...dailyMissions,
      ...achievementsData.flatMap(ach => ach.missions),
    ];
    allMissions.forEach(mission => {
      const progress = userData.missionProgress[mission.id] || 0;
      const completed = userData.missionProgress[`${mission.id}_completed`] || false;
      if (progress >= mission.target && !completed) {
        count++;
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
        level: session.user.level || 0,
        xp: session.user.xp || 0,
        newAchievements: session.user.newAchievements || 0,
        pendingMissionCompletions: session.user.pendingMissionCompletions || 0,
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
          icon: false,
        };
        if (type === 'mission') {
          toast.success(message, toastOptions);
        } else if (type === 'achievement') {
          toast.success(message, {
            ...toastOptions,
            style: { backgroundColor: color, color: '#FFFFFF' },
          });
          setUserData(prev => ({ ...prev, newAchievements: (prev.newAchievements || 0) + 1 }));
        }
      });
      setPendingNotifications([]);
    }
  }, [pendingNotifications]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'plants') {
      setSelectedPlant(null);
    }
    if (sectionId === 'profile') {
      setUserData(prev => ({ ...prev, newAchievements: 0 }));
    } 
  };

  const queueNotification = (type, name, icon = null, id = null, color = null) => {
    setPendingNotifications(prev => {
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
          selectedPlant={selectedPlant} // Pasamos selectedPlant
          setSelectedPlant={setSelectedPlant} // Pasamos setSelectedPlant
        />
        <Footer 
          activeSection={activeSection} 
          handleSectionChange={handleSectionChange} 
          userData={userData} 
          pendingMissionsCount={pendingMissionsCount()}
          resetSelectedPlant={() => setSelectedPlant(null)} // Pasamos la función correctamente
        />
        <ImageModal />
        <ToastContainer position="bottom-right" />
      </div>

      <LoginScreen status={status} />
    </>
  );
}
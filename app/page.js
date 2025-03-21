"use client";

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import MainContent from './components/MainContent';
import ImageModal from './components/ImageModal';

export default function Home() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
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
    pendingMissionCompletions: 0,
  });
  const [achievementsData, setAchievementsData] = useState([]);
  const [pendingNotifications, setPendingNotifications] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [forceOwnProfile, setForceOwnProfile] = useState(false);

  const queueNotification = (type, name, icon = null, id = null, color = null) => {
    setPendingNotifications(prev => {
      if (prev.some(notif => notif.type === type && notif.name === name)) return prev;
      return [...prev, { type, name, icon, id, color }];
    });
  };

  const fetchFreshData = async () => {
    if (status === 'authenticated' && session?.user) {
      try {
        const response = await fetch(`/api/user/get?userId=${session.user.id}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const freshData = await response.json();
        console.log('Datos frescos cargados desde DB:', freshData);
        setPlants(freshData.plants || []);
        setUserData(prev => {
          const mergedMissionProgress = { ...freshData.missionProgress, ...prev.missionProgress };
          console.log('Fusionando missionProgress - DB:', freshData.missionProgress, 'Local:', prev.missionProgress, 'Resultado:', mergedMissionProgress);
          return {
            ...prev,
            achievements: freshData.achievements || [],
            missionProgress: mergedMissionProgress,
            profilePhoto: freshData.profilePhoto || session.user.image || null,
            name: freshData.name || session.user.name || 'Usuario autenticado',
            email: freshData.email || session.user.email,
            level: freshData.level || 0,
            xp: freshData.xp || 0,
            newAchievements: freshData.newAchievements || 0,
            pendingMissionCompletions: freshData.pendingMissionCompletions || 0,
          };
        });
      } catch (error) {
        console.error('Error al cargar datos frescos:', error);
        queueNotification('warning', 'No se pudieron cargar los datos actualizados', 'fas fa-exclamation-triangle');
      }
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log("Cargando datos iniciales de sesión:", session.user);
      fetchFreshData();
    }
  }, [session, status]);

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

  useEffect(() => {
    const selectedId = searchParams.get('selectedId');
    if (selectedId && plants.length > 0 && activeSection === 'plants') {
      const index = plants.findIndex(plant => plant.id === selectedId);
      if (index !== -1) {
        setSelectedPlant(index);
      }
    }
  }, [searchParams, plants, activeSection]);

  useEffect(() => {
    if (pendingNotifications.length > 0) {
      pendingNotifications.forEach(({ type, name, icon, id, color }) => {
        const message = (
          <div className="flex items-center gap-2">
            {icon && <i className={icon} style={{ color: type === 'achievement' ? '#FFFFFF' : type === 'warning' ? '#ff9800' : '#4caf50' }}></i>}
            <span>{type === 'mission' && !name.includes('Riego Exitoso') ? `Misión completada: ${name}` : name}</span>
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
        } else if (type === 'warning') {
          toast.warning(message, toastOptions);
        }
      });
      setPendingNotifications([]);
    }
  }, [pendingNotifications]);

  const dailyMissions = [
    { id: "checkPlant", name: "Chequear Planta", xp: 10, target: 1, icon: "fas fa-eye" },
    { id: "waterPlant", name: "Regar Planta", xp: 15, target: 1, icon: "fas fa-tint" },
    { id: "updatePlant", name: "Actualizar Planta", xp: 20, target: 1, icon: "fas fa-sync-alt" },
  ];

  const pendingMissionsCount = userData && achievementsData ? (() => {
    let count = 0;
    const allMissions = [...dailyMissions, ...achievementsData.flatMap(ach => ach.missions)];
    allMissions.forEach(mission => {
      const progress = userData.missionProgress[mission.id] || 0;
      const completed = userData.missionProgress[`${mission.id}_completed`] || false;
      if (progress >= mission.target && !completed) {
        count++;
      }
    });
    return count;
  })() : 0;

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    const userIdFromUrl = searchParams.get('userId');
    setForceOwnProfile(sectionId === 'profile' && !userIdFromUrl);
    fetchFreshData();
    if (sectionId === 'plants') {
      setSelectedPlant(null);
      window.history.pushState({}, '', '/');
    } else if (sectionId === 'profile' && !userIdFromUrl) {
      setUserData(prev => ({
        ...prev,
        newAchievements: 0,
      }));
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', '/');
    }
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
          selectedPlant={selectedPlant}
          setSelectedPlant={setSelectedPlant}
          forceOwnProfile={forceOwnProfile}
          achievementsData={achievementsData}
        />
        <Footer 
          activeSection={activeSection} 
          handleSectionChange={handleSectionChange} 
          userData={userData} 
          pendingMissionsCount={pendingMissionsCount}
          resetSelectedPlant={() => setSelectedPlant(null)}
        />
        <ImageModal />
        <ToastContainer position="bottom-right" />
      </div>

      <LoginScreen status={status} />
    </>
  );
}
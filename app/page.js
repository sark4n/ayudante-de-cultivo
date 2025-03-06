"use client";

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { showTipOfTheDay } from './lib/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import MainContent from './components/MainContent';
import ImageModal from './components/ImageModal';
import NotificationQueue from './components/NotificationQueue';

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
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
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
        try {
          const response = await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userData, plants }),
          });
          if (!response.ok) {
            console.error('Error al actualizar datos:', await response.json());
          }
        } catch (error) {
          console.error('Error en useEffect de actualización:', error);
        }
      };
      updateData();
    }
  }, [userData, plants, status, session]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const queueNotification = (type, name, icon = null, id = null, color = null) => {
    setNotifications(prev => [...prev, { type, name, icon, id, color }]);
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
          setActiveSection={setActiveSection}
          queueNotification={queueNotification}
        />
        <Footer activeSection={activeSection} handleSectionChange={handleSectionChange} userData={userData} />
        <ImageModal />
        <NotificationQueue notifications={notifications} setNotifications={setNotifications} />
      </div>

      <LoginScreen status={status} />
    </>
  );
}
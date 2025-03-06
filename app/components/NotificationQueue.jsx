"use client";

import { useEffect, useState } from 'react';

export default function NotificationQueue({ notifications, setNotifications }) {
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      const nextNotification = notifications[0];
      setCurrentNotification(nextNotification);
      setTimeout(() => {
        setCurrentNotification(null);
        setNotifications(prev => prev.slice(1));
      }, 2000);
    }
  }, [notifications, currentNotification, setNotifications]);

  if (!currentNotification) return null;

  const { type, name, icon, id, color } = currentNotification;
  const isMission = type === 'mission';
  const popupStyle = isMission
    ? { background: 'linear-gradient(to right, #4caf50, #388e3c)' }
    : { background: `linear-gradient(to right, ${color}, ${shadeColor(color, -20)})` };

  return (
    <div
      id={isMission ? 'missionPopup' : 'achievementPopup'}
      className={isMission ? '' : `achievementPopup ${id}`}
      style={{ ...popupStyle, display: 'flex' }}
    >
      <i className={isMission ? 'fas fa-check' : icon} style={{ fontSize: '20px' }}></i>
      <div className="notification-content">
        <span>{isMission ? '¡Misión Completa!' : '¡Logro Obtenido!'}</span>
        <span>{name}</span>
      </div>
    </div>
  );
}

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);
  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;
  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);
  return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
}
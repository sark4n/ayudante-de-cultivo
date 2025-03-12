"use client";

import { SessionProvider } from "next-auth/react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/globals.css';
import './styles/reset.css';
import './styles/layout.css';
import './styles/auth.css';
import './styles/modal.css';
import './styles/plants.css';
import './styles/stats.css';
import './styles/achievements.css';
import './styles/profile.css';
import './styles/home/carousel.css';
import './styles/home/userSummary.css';
import './styles/home/actionCards.css';
import './styles/home/featuredPlant.css';
import './styles/home/footerText.css';
import './styles/home/dailyMissions.css';
import './styles/home/dailyOffer.css';
import './styles/home/communityWidget.css'; 

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
"use client";

import { SessionProvider } from "next-auth/react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './globals.css'
import './styles/reset.css';
import './styles/layout.css';
import './styles/auth.css';
import './styles/modal.css';
import './styles/plants.css';
import './styles/stats.css';
import './styles/achievements.css';
import './styles/profile.css';

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
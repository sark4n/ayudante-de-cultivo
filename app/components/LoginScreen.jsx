"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginScreen({ status }) {
  const [authMessage, setAuthMessage] = useState('');

  const handleLogin = async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!email || !password) {
      setAuthMessage('Por favor, ingresa un email y contraseña válidos.');
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setAuthMessage(result.error);
    } else {
      setAuthMessage('');
    }
  };

  const handleRegister = async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!email || !password) {
      setAuthMessage('Por favor, ingresa un email y contraseña válidos.');
      return;
    }

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      setAuthMessage(data.error);
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setAuthMessage(result.error);
    } else {
      setAuthMessage('Registro exitoso. Sesión iniciada.');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div id="loginScreen" className={status !== 'authenticated' ? 'active' : 'hidden'} style={{ height: '100vh', background: '#e8f5e9', transition: 'all 0.3s' }}>
      <h1 className="flex items-center gap-10 text-green-700 mb-20 dark:text-green-300"><i className="fas fa-leaf"></i> Mi Cultivo</h1>
      <form id="authForm" className="flex flex-col gap-15 w-full max-w-300" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          id="email"
          placeholder="Correo electrónico"
          required
          className="p-10 border border-green-200 rounded-md w-full dark:border-green-600 dark:bg-gray-800 dark:text-gray-300"
        />
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          required
          className="p-10 border border-green-200 rounded-md w-full dark:border-green-600 dark:bg-gray-800 dark:text-gray-300"
        />
        <button
          type="button"
          onClick={handleLogin}
          className="bg-green-500 text-white p-10 rounded-md hover:bg-green-600 flex items-center gap-5 dark:bg-green-600 dark:hover:bg-green-700"
        >
          <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={handleRegister}
          className="bg-green-500 text-white p-10 rounded-md hover:bg-green-600 flex items-center gap-5 dark:bg-green-600 dark:hover:bg-green-700"
        >
          <i className="fas fa-user-plus"></i> Registrarse
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-blue-600 text-white p-10 rounded-md hover:bg-blue-700 flex items-center gap-5 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <i className="fas fa-google"></i> Iniciar con Google
        </button>
      </form>
      <p id="authMessage" className="mt-10 text-black text-14 dark:text-gray-300">{authMessage}</p>
    </div>
  );
}
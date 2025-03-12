"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginScreen({ status }) {
  const [authMessage, setAuthMessage] = useState("");

  const handleLogin = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) {
      setAuthMessage("Por favor, ingresa un email y contraseña válidos.");
      return;
    }

    const result = await signIn("credentials", { redirect: false, email, password });
    if (result?.error) setAuthMessage(result.error);
    else setAuthMessage("");
  };

  const handleRegister = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) {
      setAuthMessage("Por favor, ingresa un email y contraseña válidos.");
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      setAuthMessage(data.error);
      return;
    }

    const result = await signIn("credentials", { redirect: false, email, password });
    if (result?.error) setAuthMessage(result.error);
    else setAuthMessage("Registro exitoso. Sesión iniciada.");
  };

  const handleGoogleLogin = () => signIn("google", { callbackUrl: "/" });

  return (
    <div id="loginScreen" className={status !== "authenticated" ? "" : "hidden"}>
      <h1>
        <i className="fas fa-leaf"></i> Bienvenido al Asistente de Cultivo
      </h1>
      <form id="authForm" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          id="email"
          placeholder="Correo electrónico"
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          required
        />
        <button type="button" onClick={handleLogin}>
          <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
        </button>
        <button type="button" onClick={handleRegister}>
          <i className="fas fa-user-plus"></i> Registrarse
        </button>
        <button type="button" id="googleLoginBtn" onClick={handleGoogleLogin}>
          <i className="fa-brands fa-google"></i> Iniciar con Google
        </button>
      </form>
      <p id="authMessage">{authMessage}</p>
    </div>
  );
}
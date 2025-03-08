// este route.js esta ubicando en api/auth/[...nextauth]/route.jsx

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from '../../../lib/mongodb';
import { initializeAchievements } from "../../../lib/missions";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("miCultivo");
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Usuario no encontrado. Por favor, regístrate primero.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Contraseña incorrecta.");
        }

        return { id: user._id.toString(), email: user.email, name: user.name, image: user.profilePhoto || null };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account }) {
      const client = await clientPromise;
      const db = client.db("miCultivo");
      const existingUser = await db.collection("users").findOne({ email: user.email });
      if (!existingUser && account.provider === "google") {
        await db.collection("users").insertOne({
          email: user.email,
          name: user.name,
          profilePhoto: user.image,
          plants: [],
          achievements: [],
          missionProgress: {},
          createdAt: new Date(),
        });
      } else if (existingUser && account.provider === "google" && !existingUser.profilePhoto) {
        await db.collection("users").updateOne(
          { email: user.email },
          { $set: { profilePhoto: user.image } }
        );
      }
      await initializeAchievements(); // Aseguramos que los logros estén inicializados
      return true;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      const client = await clientPromise;
      const db = client.db("miCultivo");
      const user = await db.collection("users").findOne({ email: session.user.email });
      if (user) {
        console.log("Datos cargados desde MongoDB:", user);
        session.user.profilePhoto = user.profilePhoto || session.user.image;
        session.user.plants = user.plants || [];
        session.user.achievements = user.achievements || [];
        session.user.missionProgress = user.missionProgress || {};
        session.user.name = user.name || session.user.name;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
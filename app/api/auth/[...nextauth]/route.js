import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
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
        const client = new MongoClient(process.env.MONGODB_URI);
        try {
          await client.connect();
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
        } catch (error) {
          throw new Error(error.message);
        } finally {
          await client.close();
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account }) {
      const client = new MongoClient(process.env.MONGODB_URI);
      try {
        await client.connect();
        const db = client.db("miCultivo");
        const existingUser = await db.collection("users").findOne({ email: user.email });
        if (!existingUser && account.provider === "google") {
          await db.collection("users").insertOne({
            email: user.email,
            name: user.name,
            profilePhoto: user.image, // Guardar la foto de Google
            plants: [],
            achievements: [],
            missionProgress: {},
            createdAt: new Date(),
          });
        } else if (existingUser && account.provider === "google" && !existingUser.profilePhoto) {
          // Actualizar foto si no existe
          await db.collection("users").updateOne(
            { email: user.email },
            { $set: { profilePhoto: user.image } }
          );
        }
        return true;
      } catch (error) {
        console.error("Error al registrar usuario de Google:", error);
        return false;
      } finally {
        await client.close();
      }
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      const client = new MongoClient(process.env.MONGODB_URI);
      try {
        await client.connect();
        const db = client.db("miCultivo");
        const user = await db.collection("users").findOne({ email: session.user.email });
        if (user) {
          session.user.profilePhoto = user.profilePhoto || session.user.image; // Usar foto de MongoDB o Google
          session.user.plants = user.plants || [];
          session.user.achievements = user.achievements || [];
          session.user.missionProgress = user.missionProgress || {};
          session.user.name = user.name || session.user.name;
        }
      } catch (error) {
        console.error("Error al cargar datos de usuario:", error);
      } finally {
        await client.close();
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
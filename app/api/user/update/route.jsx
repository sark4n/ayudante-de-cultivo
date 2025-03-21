import clientPromise from '../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }

  const { userData, plants } = await req.json();
  const client = await clientPromise;
  const db = client.db("miCultivo");

  // Actualizar todos los campos relevantes de userData
  const updateData = {
    profilePhoto: userData.profilePhoto,
    plants: plants || [],
    achievements: userData.achievements || [],
    missionProgress: userData.missionProgress || {},
    bio: userData.bio || '',
    theme: userData.theme || 'default',
    isOnline: userData.isOnline ?? true, // Usar el valor enviado o true por defecto
    allowMessages: userData.allowMessages ?? true,
    name: userData.name || session.user.name, // Preservar el nombre si no se envía
    email: userData.email || session.user.email, // Preservar el email si no se envía
    level: userData.level || 0,
    xp: userData.xp || 0,
    newAchievements: userData.newAchievements || 0,
  };

  const result = await db.collection("users").updateOne(
    { email: session.user.email },
    { $set: updateData }
  );

  console.log("Resultado de la actualización en MongoDB:", result);
  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: 'Datos actualizados', updated: result.modifiedCount }), { status: 200 });
}
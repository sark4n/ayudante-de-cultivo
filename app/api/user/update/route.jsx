

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
  const result = await db.collection("users").updateOne(
    { email: session.user.email },
    { $set: { 
      profilePhoto: userData.profilePhoto, 
      plants: plants || [], 
      achievements: userData.achievements || [], 
      missionProgress: userData.missionProgress || {} 
    } }
  );
  console.log("Resultado de la actualización en MongoDB:", result);
  return new Response(JSON.stringify({ message: 'Datos actualizados' }), { status: 200 });
}
import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }

  const { userData, plants } = await req.json();
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
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
  } catch (error) {
    console.error("Error al actualizar datos en MongoDB:", error);
    return new Response(JSON.stringify({ error: 'Error al actualizar datos: ' + error.message }), { status: 500 });
  } finally {
    await client.close();
  }
}
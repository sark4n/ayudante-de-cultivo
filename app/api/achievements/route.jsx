// este route.js esta ubicando en api/achievements/route.jsx

import clientPromise from '../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("miCultivo");
    const achievements = await db.collection("achievements").find({}).toArray();
    const achievementsData = achievements.map(ach => ({
      ...ach,
      _id: ach._id.toString(), // Convertimos ObjectId a string
    }));
    return new Response(JSON.stringify(achievementsData), { status: 200 });
  } catch (error) {
    console.error("Error al obtener logros:", error);
    return new Response(JSON.stringify({ error: 'Error al obtener logros' }), { status: 500 });
  }
}
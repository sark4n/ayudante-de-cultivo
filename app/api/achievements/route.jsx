import clientPromise from '../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("miCultivo");
    const achievements = await db.collection("achievements").find({}).toArray();
    
    const achievementsData = achievements.map(ach => ({
      ...ach,
      _id: ach._id.toString(),
      missions: ach.missions.map(mission => ({
        ...mission,
        xp: mission.xp || (mission.id === "addFirstPlant" ? 50 : mission.id === "addFirstUpdate" ? 75 : 100), // Ejemplo de XP ajustado
      })),
    }));
    
    return new Response(JSON.stringify(achievementsData), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error al obtener logros:", error);
    return new Response(JSON.stringify({ error: 'Error al obtener logros' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
import { MongoClient } from 'mongodb';
import bcrypt from "bcryptjs"; // Cambia esta línea

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Por favor, ingresa un email y contraseña válidos.' }), { status: 400 });
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("miCultivo");
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Este correo ya está registrado.' }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      name: email.split('@')[0],
      createdAt: new Date(),
    };
    await db.collection("users").insertOne(newUser);

    return new Response(JSON.stringify({ message: 'Registro exitoso.' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al registrarse: ' + error.message }), { status: 500 });
  } finally {
    await client.close();
  }
}
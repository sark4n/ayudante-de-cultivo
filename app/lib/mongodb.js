import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getUsers() {
  const client = await clientPromise;
  const db = client.db('Cluster0'); // ¡Cambia 'yourDatabaseName' por el nombre real de tu DB!
  const users = await db.collection('users').find({}).toArray();
  return users.map(user => ({
    id: user._id.toString(), // Convertimos ObjectId a string
    name: user.name,
    profilePhoto: user.profilePhoto,
    plants: user.plants || [],
    isOnline: user.isOnline || false,
    allowMessages: user.allowMessages !== false,
  }));
}

export async function getUserById(userId) {
  const client = await clientPromise;
  const db = client.db('Cluster0'); // ¡Cambia 'yourDatabaseName' por el nombre real de tu DB!
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (!user) return null;
  return {
    id: user._id.toString(),
    name: user.name,
    profilePhoto: user.profilePhoto,
    plants: user.plants || [],
    isOnline: user.isOnline || false,
    bio: user.bio || '',
    level: user.level || 0,
    xp: user.xp || 0,
    achievements: user.achievements || [],
    allowMessages: user.allowMessages !== false,
  };
}

export async function saveMessage({ recipientId, message, senderId, date }) {
  const client = await clientPromise;
  const db = client.db('Cluster0'); // ¡Cambia 'yourDatabaseName' por el nombre real de tu DB!
  const result = await db.collection('messages').insertOne({
    recipientId: new ObjectId(recipientId),
    message,
    senderId: new ObjectId(senderId),
    date,
  });
  return result;
}

export default clientPromise;
import { NextResponse } from 'next/server';
import { getUserById } from '../../../lib/mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  try {
    const user = await getUserById(userId); // Debe devolver id, name, profilePhoto, plants, etc.
    if (!user) throw new Error('Usuario no encontrado');
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching user profile' }, { status: 500 });
  }
}
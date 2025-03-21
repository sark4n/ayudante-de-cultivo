// ./app/api/user/get/route.jsx
import { NextResponse } from 'next/server';
import { getUserById } from '../../../lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 });
    }
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error en /api/user/get:', error);
    return NextResponse.json({ error: 'Error fetching user', details: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getUsers } from '../../../lib/mongodb';

export async function GET() {
  try {
    const users = await getUsers();
    console.log('Usuarios obtenidos exitosamente:', users); // Log para depurar
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error en /api/community/users:', error); // Log del error
    return NextResponse.json({ error: 'Error fetching users', details: error.message }, { status: 500 });
  }
}